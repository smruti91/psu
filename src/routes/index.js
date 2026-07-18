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
router.get(
    '/profile-trns-history/:profileId',
    ensureAuth,
    profileHistoryController.getProfileHistory
);
module.exports = router; 
