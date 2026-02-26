const router = require('express').Router();
const AuthController = require('../controllers/AuthController'); 
const { isLoggedIn } = require('../middlewares/sessionValidator');

router.get('/', isLoggedIn, AuthController.showLogin);
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/refresh-captcha', AuthController.refreshCaptcha);
router.get('/logout', AuthController.logout);

module.exports = router;
