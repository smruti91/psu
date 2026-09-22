const router = require('express').Router();
const SecController = require('../controllers/SecController');
const { ensureAuth } = require('../middlewares/auth');
const { upload } = require('../../app');
const csrf = require('csurf');
const csrfProtection = csrf();
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

router.use(SecController.setUserLocals)

router.get('/', ensureAuth, SecController.dashboard);
router.post('/approve/:id', SecController.approveRecord);
router.get('/pending-profile', ensureAuth, SecController.getPendingProfile);
router.post('/approve-profile', ensureAuth, SecController.approveProfile);
router.post('/reject-profile', ensureAuth, SecController.rejectProfile);
// Legacy alias - shows the SEC pending queue as well.
router.get('/profile/', ensureAuth, SecController.getPendingProfile);

module.exports = router;