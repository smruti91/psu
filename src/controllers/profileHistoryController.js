const AuthController = require('./AuthController');
profileHistoryService = require('../services/profileHistoryService');
const pool = require('../config/db');
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
exports.getProfileHistory = async (req, res) => {

    try{

        const profileId = req.params.profileId;

        const [profileHistory] = await pool.execute(`
            SELECT
                id,
                snapshot,
                action,
                changed_by,
                created_at
            FROM tbl_psu_profile_history
            WHERE profile_id=?
            ORDER BY created_at DESC
        `,[profileId]);

        const [shareholderHistory] = await pool.execute(`
            SELECT
                snapshot,
                created_at
            FROM tbl_psu_shareholder_history
            WHERE profile_id=?
            ORDER BY created_at DESC
        `,[profileId]);
        console.log(shareholderHistory[0].snapshot);
 
        res.render('partials/profileHistoryModal',{

            layout:false,

            profileHistory,
            shareholderHistory

        });

    }catch(err){

        console.log(err);

        res.status(500).send(err.message);

    }

};