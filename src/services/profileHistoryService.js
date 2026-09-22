const pool = require('../config/db');

// Log a status transition (send / approve / reject) as a history entry.
// Stores a snapshot of the CURRENT row so each version stays viewable.
exports.logProfileTransition = async (profileId, action, changedBy) => {
    const [rows] = await pool.execute(
        'SELECT * FROM tbl_psu_profile WHERE id = ?',
        [profileId]
    );
    if (!rows || rows.length === 0) return;
    await pool.execute(
        `INSERT INTO tbl_psu_profile_history
            (profile_id, snapshot, changed_by, action)
         VALUES (?, ?, ?, ?)`,
        [profileId, JSON.stringify(rows[0]), changedBy || null, action]
    );
};

exports.getProfiles = async(role,user)=>{

    let sql = `
        SELECT
            y.*,
            p.Auth_Share_Capital,
            p.Sub_Share_Capital,
            p.Paid_Share_Capital,
            p.Govt_Contri_Amt,
            p.Govt_Contri_Percent,
            p.roc_document,
            p.moa_document,
            n.Psu_Name,
            p.status as profile_status
        FROM tbl_psu_yearwise_mstr y
        JOIN tbl_psu_profile p
        ON y.profile_id=p.id
        JOIN tbl_psu_name n
        ON p.psu_id=n.id
    `;

    let params=[];

    // NOTE: session Role is a string ('1'..'5') - compare as string.
    switch(String(role)){

        // Department - own department's profiles
        case '2':
            sql += " WHERE y.DmdNo=?";
            params.push(user.dmdNo);
        break;

        // PSU - own profiles only
        case '3':
            sql += " WHERE y.user_id=?";
            params.push(user.id);
        break;

        // SEC - own department's profiles
        case '5':
            sql += " WHERE y.DmdNo=?";
            params.push(user.dmdNo);
        break;

        // Finance/Admin - all profiles
        default:
        break;
    }

    sql+=" ORDER BY y.Created_Dt DESC";

    const [rows]=await pool.execute(sql,params);

    return rows;

}

exports.attachShareholders = async (profiles) => {

    const [shareholders] = await pool.execute(`
        SELECT
            profile_id,
            shareholder_name,
            shareholder_percent
        FROM tbl_psu_shareholders
    `);

    const map = {};

    shareholders.forEach(row => {

        if(!map[row.profile_id])
            map[row.profile_id]=[];

        map[row.profile_id].push(row);

    });

    profiles.forEach(profile=>{

        profile.shareholders =
            map[profile.profile_id] || [];

    });

    return profiles;

}