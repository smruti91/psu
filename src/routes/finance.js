const router = require('express').Router();
const DeptController = require('../controllers/DeptController');
const FinanceController = require('../controllers/FinanceController');
const { ensureAuth } = require('../middlewares/auth');
const { upload } = require('../../app');
const csrf = require('csurf');
const csrfProtection = csrf();
const fs = require('fs');
const path = require('path');

// Set user in res.locals for all routes in this router
router.use(FinanceController.setUserLocals);
router.get('/', ensureAuth, FinanceController.dashboard);
router.get('/psu-names', ensureAuth, FinanceController.getPsuNames);

module.exports = router;