const router = require('express').Router();
const SecController = require('../controllers/SecController');
const { ensureAuth } = require('../middlewares/auth');
const { upload } = require('../../app');
const csrf = require('csurf');
const csrfProtection = csrf();
const fs = require('fs');
const path = require('path');

router.use(SecController.setUserLocals)

router.get('/', ensureAuth, SecController.dashboard);
router.post('/approve/:id', SecController.approveRecord);

module.exports = router;