const SecurityService = require('../services/SecurityService');

// Middleware to validate session and check for inactivity
exports.sessionValidator = async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  const sessionId = req.sessionID;
  
  // Validate session activity
  const isValid = await SecurityService.validateAndUpdateSession(sessionId);
  
  if (!isValid) {
    // Session expired due to inactivity
    req.session.destroy((err) => {
      if (err) console.error('Error destroying session:', err);
    });
    res.clearCookie('myapp_session');
    return res.status(401).render('home/index', {
      title: 'Login',
      errors: [{ msg: 'Your session has expired due to inactivity. Please login again.' }],
      old: {},
      captcha: null
    });
  }

  next();
};

// Middleware to prevent access if session is invalid (for protected routes)
exports.requireAuth = async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  const sessionId = req.sessionID;
  const isValid = await SecurityService.validateAndUpdateSession(sessionId);
  
  if (!isValid) {
    req.session.destroy((err) => {
      if (err) console.error('Error destroying session:', err);
    });
    res.clearCookie('myapp_session');
    return res.status(401).redirect('/');
  }

  next();
};

// Middleware to check if user is already logged in
exports.isLoggedIn = async (req, res, next) => {
  if (req.session.user) {
    const sessionId = req.sessionID;
    const isValid = await SecurityService.validateAndUpdateSession(sessionId);
    
    if (isValid) {
      return res.redirect('/psu');
    } else {
      req.session.destroy((err) => {
        if (err) console.error('Error destroying session:', err);
      });
      res.clearCookie('myapp_session');
    }
  }

  next();
};

// Cleanup task to run periodically
setInterval(async () => {
  await SecurityService.cleanupExpiredCaptchas();
  await SecurityService.cleanupInactiveSessions();
  await SecurityService.cleanupOldLoginAttempts();
}, 60 * 60 * 1000); // Run every hour
