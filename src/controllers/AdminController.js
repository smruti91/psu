const pool = require('../config/db');
exports.dashboard = (req, res) => {
  res.render('admin/dashboard', {
    layout: 'layouts/dashboard', // use the admin layout
    title: 'Admin Dashboard'
  });
};

exports.psuProfile = async (req, res) => {
  console.log('Session data:', req);
    let DemantData = null;
    const role = req.session.user.role;
    const [rows] = await pool.execute(
      `SELECT * FROM tbl_department order BY DmdNo ASC`
    );
    if (rows && rows.length > 0) {
      DemantData = rows;
    }

  res.render('admin/psu-profile', {
    layout: 'layouts/dashboard', // use the admin layout
    title: 'PSU Profile',
    successMessage: '',
    errorMessage: '',
    role: req.session.user.role,
    DemantData: DemantData
  });
};

exports.getPsuProfileData = async (req, res) => {
  console.log('Received query params:', req.query);
  const { finYr=null , dmdNo, psuId } = req.query;
  let profileData = null;
  if (!dmdNo || !psuId) return res.json({});
  let query = `SELECT p.id,d.DmdNo,d.DeptName,ps.Psu_Name,p.authorized_share_cap,p.subscribed_share_cap,p.paidup_share_cap,p.fin_year,p.status 
                FROM tbl_psu_profile AS p 
                JOIN tbl_department AS d ON p.dmd_no = d.DmdNo
                JOIN tbl_psu_name AS ps ON p.psu_id = ps.id WHERE 1=1`;
  const params = [];
  if (finYr) {
    query += ' AND p.fin_year = ?';
    params.push(finYr);
  }
  if (dmdNo) {
    query += ' AND p.dmd_no = ?';
    params.push(dmdNo);
  }
  if (psuId) {
    query += ' AND p.psu_id = ?';
    params.push(psuId);
  }
  console.log('SQL:', query);
  console.log('PARAMS:', params);
  const [rows] = await pool.execute(query, params);
  if (rows && rows.length > 0) {
    profileData = rows[0];
  }
  res.json(profileData);
};

exports.submitPsuProfileData = async (req, res) => {
 
  const {
    txtAuthorizedShareCap,
    txtSubscribedShareCap,
    txtPaidupShareCap,
    selFinYr,
    dmdNo,
    psuId
  } = req.body; 
   
  try {
    const insertQuery = `INSERT INTO tbl_psu_profile 
      (psu_id, dmd_no, authorized_share_cap, subscribed_share_cap, paidup_share_cap, fin_year)
      VALUES (?, ?, ?, ?, ?, ?)`;

    await pool.execute(insertQuery, [
      psuId,
      dmdNo,
      txtAuthorizedShareCap,
      txtSubscribedShareCap,
      txtPaidupShareCap,
      selFinYr
    ]);

     return res.json({
      success: true,
      message: 'PSU profile data saved successfully'
    });
  } catch (error) {
    console.error('Error saving PSU profile data:', error);
         
    return res.json({
      success: false,
      message: 'Error saving PSU profile data '+ error.message
    });
  }
};
