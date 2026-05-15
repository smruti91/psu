const pool = require('../config/db');
const os = require('os');

// Get device fingerprint based on IP and user agent
const getDeviceFingerprint = (req) => {
  const ip = req.ip || req.connection.remoteAddress || '';
  const userAgent = req.get('User-Agent') || '';
  return `${ip}::${userAgent}`;
};

// Get client IP address
const getClientIP = (req) => {
  return req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || '';
};

// Track login attempt
exports.trackLoginAttempt = async (username, success, req) => {
  try {
    const ip = getClientIP(req);
    await pool.query(
      "INSERT INTO login_attempts (username, ip_address, success) VALUES (?, ?, ?)",
      [username, ip, success]
    );
  } catch (error) {
    console.error('Error tracking login attempt:', error);
  }
};

// Get failed login attempts in last 15 minutes
exports.getFailedAttempts = async (username) => {
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count FROM login_attempts 
       WHERE username = ? AND success = FALSE 
       AND attempt_time > DATE_SUB(NOW(), INTERVAL 15 MINUTE)`,
      [username]
    );
    return rows[0].count;
  } catch (error) {
    console.error('Error getting failed attempts:', error);
    return 0;
  }
};

// Check if account is locked (after 5 failed attempts)
exports.isAccountLocked = async (username) => {
  try {
    const [rows] = await pool.query(
      "SELECT locked_until FROM tbl_user WHERE user_name = ?",
      [username]
    );
    
    if (rows.length === 0) return false;
    
    const lockedUntil = rows[0].locked_until;
    if (!lockedUntil) return false;
    
    if (new Date(lockedUntil) > new Date()) {
      return true;
    }
    
    // Unlock if 15 minutes have passed
    await pool.query(
      "UPDATE tbl_user SET locked_until = NULL, failed_login_attempts = 0 WHERE user_name = ?",
      [username]
    );
    return false;
  } catch (error) {
    console.error('Error checking account lock:', error);
    return false;
  }
};

// Lock account for 15 minutes
exports.lockAccount = async (username) => {
  try {
    const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
    await pool.query(
      "UPDATE tbl_user SET locked_until = ?, failed_login_attempts = failed_login_attempts + 1 WHERE user_name = ?",
      [lockUntil, username]
    );
  } catch (error) {
    console.error('Error locking account:', error);
  }
};

// Reset failed attempts after successful login
exports.resetFailedAttempts = async (username) => {
  try {
    await pool.query(
      "UPDATE tbl_user SET failed_login_attempts = 0, locked_until = NULL WHERE user_name = ?",
      [username]
    );
  } catch (error) {
    console.error('Error resetting failed attempts:', error);
  }
};

// Create or update active session
exports.createActiveSession = async (userId, sessionId, req) => {
  try {
    const deviceInfo = getDeviceFingerprint(req);
    const ip = getClientIP(req);
    
    // Get existing sessions for this user and logout from other devices
    const [existingSessions] = await pool.query(
      "SELECT id, session_id FROM active_sessions WHERE user_id = ? AND is_active = TRUE",
      [userId]
    );
    
    // Mark other sessions as inactive (force logout from other devices)
    for (const session of existingSessions) {
      await pool.query(
        "UPDATE active_sessions SET is_active = FALSE WHERE session_id = ?",
        [session.session_id]
      );
    }
    
    // Create new session
    await pool.query(
      `INSERT INTO active_sessions (user_id, session_id, device_info, ip_address) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE device_info = ?, ip_address = ?, last_activity = NOW(), is_active = TRUE`,
      [userId, sessionId, deviceInfo, ip, deviceInfo, ip]
    );
    
    // Update user's last login info
    await pool.query(
      "UPDATE tbl_user SET last_login_ip = ?, last_login_device = ? WHERE id = ?",
      [ip, deviceInfo, userId]
    );
  } catch (error) {
    console.error('Error creating active session:', error);
  }
};

// Check if session is still valid and update last activity
exports.validateAndUpdateSession = async (sessionId) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM active_sessions WHERE session_id = ? AND is_active = TRUE",
      [sessionId]
    );
    
    if (rows.length === 0) return false;
    
    const session = rows[0];
    const lastActivity = new Date(session.last_activity);
    const now = new Date();
    const inactiveMinutes = (now - lastActivity) / (1000 * 60);
    
    // Session inactive for more than 30 minutes - mark as inactive
    if (inactiveMinutes > 30) {
      await pool.query(
        "UPDATE active_sessions SET is_active = FALSE WHERE session_id = ?",
        [sessionId]
      );
      return false;
    }
    
    // Update last activity
    await pool.query(
      "UPDATE active_sessions SET last_activity = NOW() WHERE session_id = ?",
      [sessionId]
    );
    
    return true;
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
};

// Invalidate all sessions for a user
exports.invalidateUserSessions = async (userId) => {
  try {
    await pool.query(
      "UPDATE active_sessions SET is_active = FALSE WHERE user_id = ?",
      [userId]
    );
  } catch (error) {
    console.error('Error invalidating user sessions:', error);
  }
};

// Get remaining lockout time in minutes
exports.getRemainingLockoutTime = async (username) => {
  try {
    const [rows] = await pool.query(
      "SELECT locked_until FROM tbl_user WHERE user_name = ?",
      [username]
    );
    
    if (rows.length === 0 || !rows[0].locked_until) return 0;
    
    const lockedUntil = new Date(rows[0].locked_until);
    const now = new Date();
    const remainingMs = lockedUntil - now;
    
    if (remainingMs <= 0) return 0;
    
    return Math.ceil(remainingMs / (1000 * 60));
  } catch (error) {
    console.error('Error getting remaining lockout time:', error);
    return 0;
  }
};

// Clean up expired CAPTCHA entries
exports.cleanupExpiredCaptchas = async () => {
  try {
    await pool.query(
      "DELETE FROM captcha_cache WHERE expires_at IS NOT NULL AND expires_at < NOW()"
    );
  } catch (error) {
    console.error('Error cleaning up captchas:', error);
  }
};

// Clean up inactive sessions older than 24 hours
exports.cleanupInactiveSessions = async () => {
  try {
    await pool.query(
      "DELETE FROM active_sessions WHERE is_active = FALSE AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR)"
    );
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
  }
};

// Clean up old login attempts older than 30 days
exports.cleanupOldLoginAttempts = async () => {
  try {
    await pool.query(
      "DELETE FROM login_attempts WHERE attempt_time < DATE_SUB(NOW(), INTERVAL 30 DAY)"
    );
  } catch (error) {
    console.error('Error cleaning up login attempts:', error);
  }
};

// Run cleanup tasks
setInterval(async () => {
  await exports.cleanupExpiredCaptchas();
  await exports.cleanupInactiveSessions();
  await exports.cleanupOldLoginAttempts();
}, 60 * 60 * 1000); // Run every hour
