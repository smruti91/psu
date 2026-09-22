const router = require('express').Router();
const AdminController = require('../controllers/AdminController');
// const { ensureAdmin } = require('../middlewares/auth'); // enable later if you want auth

router.get('/', /*ensureAdmin,*/ AdminController.dashboard);
router.get('/psu-profile', /*ensureAdmin,*/ AdminController.psuProfile);
router.get('/profile-data', /*ensureAdmin,*/ AdminController.getPsuProfileData);
router.post('/save-profile-data', /*ensureAdmin,*/ AdminController.submitPsuProfileData);

// --- User Management (admin only, enforced in controller) ---
router.get('/users', AdminController.users);
router.post('/users/create', AdminController.createUser);
router.post('/users/toggle-status', AdminController.toggleUserStatus);

module.exports = router;
