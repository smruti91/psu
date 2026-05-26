require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const pool = require('./src/config/db');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const { sessionValidator, requireAuth } = require('./src/middlewares/sessionValidator');


const app = express();

// Security + performance

// Middleware for form data without files
//app.use(upload.none());


app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    contentSecurityPolicy: false
  })
);
app.use(compression());
app.use(morgan('dev'));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (your template assets)
app.use(express.static(path.join(__dirname, 'public')));

// Session store in MySQL
const sessionStore = new MySQLStore({}, pool);

// Session middleware
app.use(session({
  key: 'myapp_session',
  secret: process.env.SESSION_SECRET || 'superSecretKey',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,       // prevents JS access
    secure: false,        // true if HTTPS
    maxAge: 15 * 60 * 1000 // 15 minutes - enforced by sessionValidator middleware
  }
}));




// ✅ Apply CSRF AFTER cookieParser & session


// ✅ Session Validator Middleware (checks for inactivity and session validity)
app.use(sessionValidator);

// ✅ Make CSRF token available to ALL EJS views

const multer = require('multer');
const upload = multer({ 
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});
const csrfProtection = csrf();

//app.use(csrfProtection);

app.use((req, res, next) => {
    // If the request is a file upload, skip global CSRF here 
    // and handle it manually in the router.
    if (req.is('multipart/form-data')) {
        return next();
    }
    csrfProtection(req, res, next);
});

app.use((req, res, next) => {
    // Note: if it's a multipart request, we might need a dummy or 
    // a pre-generated token if the middleware was skipped above.
    res.locals.csrfToken = req.csrfToken ? req.csrfToken() : ''; 
    res.locals.role = req.session?.user?.role || null; // 86
    res.locals.user = req.session?.user || null;
    next();
});
// ✅ Export for routes if needed
module.exports.csrfProtection = csrfProtection;
module.exports.upload = upload;


// Views (EJS + layouts)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/public'); 

// Routes
const indexRouter = require('./src/routes/index');
const adminRouter = require('./src/routes/admin');
const psuRouter = require('./src/routes/psu');
const authRouter = require('./src/routes/auth');
const deptRouter = require('./src/routes/dept');
const financeRouter = require('./src/routes/finance');

// Apply requireAuth to protected routes
app.use('/', indexRouter);
app.use('/admin', requireAuth, adminRouter);
app.use('/psu', requireAuth, psuRouter);
app.use('/dept', requireAuth, deptRouter);
app.use('/finance', requireAuth, financeRouter);
app.use('/auth', authRouter);


// 404
app.use((req, res) => {
  res.status(404).render('home/404', { title: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running: http://localhost:${PORT}`);
});
