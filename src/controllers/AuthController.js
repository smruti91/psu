const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const captcha = require('svg-captcha');
const pool = require('../config/db');
const SecurityService = require('../services/SecurityService');

// Show login page with CAPTCHA
exports.showLogin = async (req, res) => {
  // Generate CAPTCHA
  const svg_captcha = captcha.create({ 
    size: 4,
    ignoreChars: '0o1i',
    noise: 0,
    color: false,
    background: '#fff'
  });
  
  const sessionId = req.sessionID;
  //console.log('Generated CAPTCHA for session:', sessionId);
  try {
    // Store CAPTCHA in database with 10 minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await pool.query(
      `INSERT INTO captcha_cache (session_id, captcha_text, expires_at, attempt_count) 
       VALUES (?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE captcha_text = ?, expires_at = ?, attempt_count = 0`,
      [sessionId, svg_captcha.text.toUpperCase(), expiresAt, svg_captcha.text.toUpperCase(), expiresAt]
    );
  } catch (error) {
    console.error('Error storing CAPTCHA:', error);
  }
  
  res.render('home/index', { 
    title: 'Login', 
    errors: [], 
    old: {},
    captcha: svg_captcha.data,
    captchaId: sessionId
  });
};

// Handle login
exports.login = [
  // Validation - case sensitive
 body('username')
  .notEmpty().withMessage('Username required')
  .trim()
  .isLength({ min: 3 }).withMessage('Username must be at least 8 characters')
  .escape(),

body('password')
  .notEmpty().withMessage('Password required'),

body('captcha')
  .notEmpty().withMessage('CAPTCHA required')
  .trim()
  .escape(),

  async (req, res) => {
  
    const errors = [];
    const validationErrors = validationResult(req);
    
    if (!validationErrors.isEmpty()) {
      // Regenerate CAPTCHA
      const svg_captcha = captcha.create({ 
        size: 4,
        ignoreChars: '0o1i',
        noise: 2,
        color: false,
        background: '#fff'
      });
      
      const sessionId = req.sessionID;
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

       
      
      try {
        await pool.query(
          `INSERT INTO captcha_cache (session_id, captcha_text, expires_at, attempt_count) 
           VALUES (?, ?, ?, 0)
           ON DUPLICATE KEY UPDATE captcha_text = ?, expires_at = ?, attempt_count = 0`,
          [sessionId, svg_captcha.text.toUpperCase(), expiresAt, svg_captcha.text.toUpperCase(), expiresAt]
        );
      } catch (error) {
        console.error('Error storing CAPTCHA:', error);
      }
      
      return res.render('home/index', { 
        title: 'Login', 
        errors: validationErrors.array(), 
        old: req.body,
        captcha: svg_captcha.data,
        captchaId: sessionId
      });
    }

    const { username, password, captcha: captchaInput } = req.body;
    // Prefer captchaId posted from the form (in case session cookie isn't sent), fall back to req.sessionID
    const sessionId = req.body.captchaId || req.sessionID;
    const clientIP = req.ip || req.connection.remoteAddress || '';

    try {
      // Check if account is locked due to brute force
      const isLocked = await SecurityService.isAccountLocked(username);
      if (isLocked) {
        const remainingTime = await SecurityService.getRemainingLockoutTime(username);
        // Regenerate CAPTCHA
        const svg_captcha = captcha.create({ 
          size: 4,
          ignoreChars: '0o1i',
          noise: 2,
          color: false,
          background: '#fff'
        });
        
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        
        try {
          await pool.query(
            `INSERT INTO captcha_cache (session_id, captcha_text, expires_at, attempt_count) 
             VALUES (?, ?, ?, 0)
             ON DUPLICATE KEY UPDATE captcha_text = ?, expires_at = ?, attempt_count = 0`,
            [sessionId, svg_captcha.text.toUpperCase(), expiresAt, svg_captcha.text.toUpperCase(), expiresAt]
          );
        } catch (error) {
          console.error('Error storing CAPTCHA:', error);
        }
        
        return res.render('home/index', { 
          title: 'Login', 
          errors: [{ msg: `Account locked. Try again in ${remainingTime} minutes.` }], 
          old: { username },
          captcha: svg_captcha.data,
          captchaId: sessionId
        });
      }

      // Verify CAPTCHA - CASE SENSITIVE
      
      const [captchaRows] = await pool.query(
        "SELECT * FROM captcha_cache WHERE session_id = ? AND expires_at > NOW()",
        [sessionId]
      );
    
      if (captchaRows.length === 0) {
        // Regenerate CAPTCHA
        const svg_captcha = captcha.create({ 
          size: 4,
          ignoreChars: '0o1i',
          noise: 2,
          color: false,
          background: '#fff'
        });
        
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        
        try {
          await pool.query(
            `INSERT INTO captcha_cache (session_id, captcha_text, expires_at, attempt_count) 
             VALUES (?, ?, ?, 0)
             ON DUPLICATE KEY UPDATE captcha_text = ?, expires_at = ?, attempt_count = 0`,
            [sessionId, svg_captcha.text.toUpperCase(), expiresAt, svg_captcha.text.toUpperCase(), expiresAt]
          );
        } catch (error) {
          console.error('Error storing CAPTCHA:', error);
        }
        
        return res.render('home/index', { 
          title: 'Login', 
          errors: [{ msg: 'CAPTCHA has expired. Please try again.' }], 
          old: { username },
          captcha: svg_captcha.data,
          captchaId: sessionId
        });
      }

      const storedCaptcha = captchaRows[0].captcha_text;
      const captchaAttempts = captchaRows[0].attempt_count || 0;

      // CASE SENSITIVE CAPTCHA CHECK
      if (captchaInput.toUpperCase() !== storedCaptcha) {
        // Increment attempt count
        await pool.query(
          "UPDATE captcha_cache SET attempt_count = attempt_count + 1 WHERE session_id = ?",
          [sessionId]
        );

        // Regenerate CAPTCHA
        const svg_captcha = captcha.create({ 
          size: 4,
          ignoreChars: '0o1i',
          noise: 2,
          color: false,
          background: '#fff'
        });
        
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        
        try {
          await pool.query(
            `INSERT INTO captcha_cache (session_id, captcha_text, expires_at, attempt_count) 
             VALUES (?, ?, ?, 0)
             ON DUPLICATE KEY UPDATE captcha_text = ?, expires_at = ?, attempt_count = 0`,
            [sessionId, svg_captcha.text.toUpperCase(), expiresAt, svg_captcha.text.toUpperCase(), expiresAt]
          );
        } catch (error) {
          console.error('Error storing CAPTCHA:', error);
        }
        
        return res.render('home/index', { 
          title: 'Login', 
          errors: [{ msg: 'Invalid CAPTCHA. Please try again.' }], 
          old: { username },
          captcha: svg_captcha.data,
          captchaId: sessionId
        });
      }

      // CAPTCHA is valid, now validate username and password (CASE SENSITIVE)
      const user = await User.findByUserName(username);

      if (!user) {
        await SecurityService.trackLoginAttempt(username, false, req);
        
        // Regenerate CAPTCHA
        const svg_captcha = captcha.create({ 
          size: 4,
          ignoreChars: '0o1i',
          noise: 2,
          color: false,
          background: '#fff'
        });
        
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        
        try {
          await pool.query(
            `INSERT INTO captcha_cache (session_id, captcha_text, expires_at, attempt_count) 
             VALUES (?, ?, ?, 0)
             ON DUPLICATE KEY UPDATE captcha_text = ?, expires_at = ?, attempt_count = 0`,
            [sessionId, svg_captcha.text.toUpperCase(), expiresAt, svg_captcha.text.toUpperCase(), expiresAt]
          );
        } catch (error) {
          console.error('Error storing CAPTCHA:', error);
        }
        
        return res.render('home/index', { 
          title: 'Login', 
          errors: [{ msg: 'Invalid credentials' }], 
          old: { username },
          captcha: svg_captcha.data,
          captchaId: sessionId
        });
      }

      // Password comparison (CASE SENSITIVE - bcrypt is case sensitive)
      const match = await bcrypt.compare(password, user.Password);
      if (!match) {
        await SecurityService.trackLoginAttempt(username, false, req);
        
        // Check failed attempts
        const failedAttempts = await SecurityService.getFailedAttempts(username);
        if (failedAttempts >= 4) { // 5th attempt or more
          await SecurityService.lockAccount(username);
          
          // Regenerate CAPTCHA
          const svg_captcha = captcha.create({ 
            size: 4,
            ignoreChars: '0o1i',
            noise: 2,
            color: false,
            background: '#fff'
          });
          
          const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
          
          try {
            await pool.query(
              `INSERT INTO captcha_cache (session_id, captcha_text, expires_at, attempt_count) 
               VALUES (?, ?, ?, 0)
               ON DUPLICATE KEY UPDATE captcha_text = ?, expires_at = ?, attempt_count = 0`,
              [sessionId, svg_captcha.text.toUpperCase(), expiresAt, svg_captcha.text.toUpperCase(), expiresAt]
            );
          } catch (error) {
            console.error('Error storing CAPTCHA:', error);
          }
          
          return res.render('home/index', { 
            title: 'Login', 
            errors: [{ msg: 'Too many failed attempts. Account locked for 15 minutes.' }], 
            old: { username },
            captcha: svg_captcha.data,
            captchaId: sessionId
          });
        }
        
        // Regenerate CAPTCHA
        const svg_captcha = captcha.create({ 
          size: 4,
          ignoreChars: '0o1i',
          noise: 2,
          color: false,
          background: '#fff'
        });
        
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        
        try {
          await pool.query(
            `INSERT INTO captcha_cache (session_id, captcha_text, expires_at, attempt_count) 
             VALUES (?, ?, ?, 0)
             ON DUPLICATE KEY UPDATE captcha_text = ?, expires_at = ?, attempt_count = 0`,
            [sessionId, svg_captcha.text.toUpperCase(), expiresAt, svg_captcha.text.toUpperCase(), expiresAt]
          );
        } catch (error) {
          console.error('Error storing CAPTCHA:', error);
        }
        
        return res.render('home/index', { 
          title: 'Login', 
          errors: [{ msg: 'Invalid credentials' }], 
          old: { username },
          captcha: svg_captcha.data,
          captchaId: sessionId
        });
      }

      // Successful login
      await SecurityService.trackLoginAttempt(username, true, req);
      await SecurityService.resetFailedAttempts(username);
      const [profileData] = await pool.execute(
      `SELECT * FROM tbl_psu_profile WHERE psu_id = ? and dmd_no = ? and status = ?`,
      [user.Psu_id, user.DmdNo, 8]
    );
      // Save user in session
      req.session.user = { id: user.id, role: user.Role, dmdNo: user.DmdNo, Psu_Name: user.Name, psu_id: user.Psu_id , profileId: profileData.length > 0 ? profileData[0].id : null};

      // Create active session and force logout from other devices
      await SecurityService.createActiveSession(user.id, req.sessionID, req);

      // Clear CAPTCHA
      await pool.query(
        "DELETE FROM captcha_cache WHERE session_id = ?",
        [sessionId]
      );
      switch (user.Role) {
        case '3':
          res.redirect('/psu');
          break;
        case '2':
          res.redirect('/dept');
          break;
        case '4':
          res.redirect('/finance');
          break;
        case '1':
          res.redirect('/admin');
          break;
        case '5':
          res.redirect('/sec');
          break;
        default:
          res.redirect('/psu');
          break;
      }
      //res.redirect('/psu');
    } catch (error) {
      console.error('Login error:', error);
      
      // Regenerate CAPTCHA
      const svg_captcha = captcha.create({ 
        size: 4,
        ignoreChars: '0o1i',
        noise: 2,
        color: false,
        background: '#fff'
      });
      
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      try {
        await pool.query(
          `INSERT INTO captcha_cache (session_id, captcha_text, expires_at, attempt_count) 
           VALUES (?, ?, ?, 0)
           ON DUPLICATE KEY UPDATE captcha_text = ?, expires_at = ?, attempt_count = 0`,
          [sessionId, svg_captcha.text.toUpperCase(), expiresAt, svg_captcha.text.toUpperCase(), expiresAt]
        );
      } catch (error) {
        console.error('Error storing CAPTCHA:', error);
      }
      
      return res.render('home/index', { 
        title: 'Login', 
        errors: [{ msg: 'An error occurred. Please try again.' }], 
        old: { username },
        captcha: svg_captcha.data,
        captchaId: sessionId
      });
    }
  }
];
// Handle register
  
exports.register = [
  // Validation rules

  body('department').notEmpty().withMessage('Department is required'),
  body('username').notEmpty().withMessage('Valid username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
 

 async (req, res) => {
 
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('home/index', {
        layout: 'layouts/public',
        title: 'Welcome',
        errors: errors.array(),
        old: req.body,
        success: null
      });
    }

    const { department, username, password } = req.body;

    // Check if email already exists
    // const existingUser = await User.findByEmail(email);
    // if (existingUser) {
    //   return res.render('auth/register', {
    //     layout: 'layouts/public',
    //     title: 'Register',
    //     errors: [{ msg: 'Email is already registered' }],
    //     old: req.body
    //   });
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    await User.create(department, username, hashedPassword);

    // Redirect to login
     res.render('home/index', {
      layout: 'layouts/public',
      title: 'Welcome',
      errors: [],
      old: {},
      success: 'Account created successfully! Please login.'
    });
  }
];
// Refresh CAPTCHA (AJAX endpoint)
exports.refreshCaptcha = async (req, res) => {
  try {
    const svg_captcha = captcha.create({ 
      size: 4,
      ignoreChars: '0o1i',
      noise: 2,
      color: false,
      background: '#fff'
    });
    
    const sessionId = req.sessionID;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await pool.query(
      `INSERT INTO captcha_cache (session_id, captcha_text, expires_at, attempt_count) 
       VALUES (?, ?, ?, 0)
       ON DUPLICATE KEY UPDATE captcha_text = ?, expires_at = ?, attempt_count = 0`,
      [sessionId, svg_captcha.text.toUpperCase(), expiresAt, svg_captcha.text.toUpperCase(), expiresAt]
    );
    
    res.json({ 
      success: true, 
      captcha: svg_captcha.data,
      captchaId: sessionId
    });
  } catch (error) {
    console.error('Error refreshing CAPTCHA:', error);
    res.status(500).json({ success: false, message: 'Error refreshing CAPTCHA' });
  }
};

// Logout
exports.logout = async (req, res) => {
  if (req.session.user) {
    await SecurityService.invalidateUserSessions(req.session.user.id);
  }
  
  req.session.destroy(() => {
    res.clearCookie('myapp_session');
    res.redirect('/');
  });
};
