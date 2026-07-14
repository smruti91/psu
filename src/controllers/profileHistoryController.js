const AuthController = require('./AuthController');
profileHistoryService = require('../services/profileHistoryService');
exports.index = async (req, res) => {
   const role = req.session.user.role;
    const user = req.session.user;

    let profiles = await profileHistoryService.getProfiles(role,user);
    profiles = await profileHistoryService.attachShareholders(profiles);
    console.log("Profiles:", profiles); // Debugging line to check the structure of profiles
    res.render("profileHistory/index",{
        layout:"layouts/dashboard",
        title:"Profile History",
        profiles
    });

};
