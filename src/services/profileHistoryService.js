const pool = require('../config/db');

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
            n.Psu_Name,
            p.status as profile_status
        FROM tbl_psu_yearwise_mstr y
        JOIN tbl_psu_profile p
        ON y.profile_id=p.id
        JOIN tbl_psu_name n
        ON p.psu_id=n.id
    `;

    let params=[];

    switch(role){

        // Department
        case 2:
            sql += " WHERE y.DmdNo=?";
            params.push(user.dmdNo);
        break;

        // PSU User
        case 5:
            sql += " WHERE y.user_id=?";
            params.push(user.id);
        break;

        // Finance/Admin
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