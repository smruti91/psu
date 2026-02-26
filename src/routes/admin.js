const router = require('express').Router();
const AdminController = require('../controllers/AdminController');
// const { ensureAdmin } = require('../middlewares/auth'); // enable later if you want auth

router.get('/', /*ensureAdmin,*/ AdminController.dashboard);

module.exports = router;
