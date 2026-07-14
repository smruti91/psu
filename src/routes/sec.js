const router = require('express').Router();
const SecController = require('../controllers/SecController');
const { ensureAuth } = require('../middlewares/auth');
const { upload } = require('../../app');
const csrf = require('csurf');
const csrfProtection = csrf();
const fs = require('fs');
const path = require('path');
const DeptController = require('../controllers/DeptController');

router.use(SecController.setUserLocals)

router.get('/', ensureAuth, SecController.dashboard);
router.post('/approve/:id', SecController.approveRecord);
//router.get('/profile/', SecController.profile);
router.get('/profile/', DeptController.getPendingProfile);

module.exports = router;