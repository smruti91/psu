const router = require('express').Router();
const HomeController = require('../controllers/HomeController');
const { ensureAuth } = require('../middlewares/auth');
const profileHistoryController = require('../controllers/profileHistoryController');
router.get('/', HomeController.index);
router.get(
    "/profile-history",
    ensureAuth,
    profileHistoryController.index
);
module.exports = router; 
