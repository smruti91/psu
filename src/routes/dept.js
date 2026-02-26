const router = require('express').Router();
const DeptController = require('../controllers/DeptController');
const { ensureAuth } = require('../middlewares/auth');
const { upload } = require('../../app');
const csrf = require('csurf');
const csrfProtection = csrf();
const fs = require('fs');
const path = require('path');


// Set user in res.locals for all routes in this router
router.use(DeptController.setUserLocals);

router.get('/', ensureAuth, DeptController.dashboard);
router.get('/year-details/:id', DeptController.getYearDetails);
router.post('/approve/:id', DeptController.approveRecord);
router.post('/reject/:id', DeptController.rejectRecord);

module.exports = router;