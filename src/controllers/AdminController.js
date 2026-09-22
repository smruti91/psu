const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Only Admin (role '1') may manage users.
function ensureAdminUser(req, res) {
  if (!req.session?.user || String(req.session.user.role) !== '1') {
    res.status(403).json({ success: false, message: 'Forbidden: admin access required.' });
    return false;
  }
  return true;
}

const USER_ROLE_LABELS = {
  '1': 'Admin',
  '2': 'Dept',
  '3': 'PSU',
  '4': 'Finance',
  '5': 'SEC'
};
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
    selFinYr= null,
    selDmdNo,
    psuId
  } = req.body; 
   console.log('Received PSU profile data:', req.body);
  try {
    const insertQuery = `INSERT INTO tbl_psu_profile 
      (psu_id, dmd_no, authorized_share_cap, subscribed_share_cap, paidup_share_cap, fin_year)
      VALUES (?, ?, ?, ?, ?, ?)`;

    await pool.execute(insertQuery, [
      psuId,
      selDmdNo,
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

// --- User Management (Admin only) ---
// List all users with department / PSU names for display.
exports.users = async (req, res) => {
  if (!req.session?.user || String(req.session.user.role) !== '1') {
    return res.status(403).send('Forbidden');
  }
  try {
    const [users] = await pool.execute(
      `SELECT u.id, u.Psu_id, u.DmdNo, u.Name, u.user_name, u.Role, u.Status,
              u.Create_dt, d.DeptName, p.Psu_Name
       FROM tbl_user u
       LEFT JOIN tbl_department d ON d.DmdNo = u.DmdNo
       LEFT JOIN tbl_psu_name p ON p.id = u.Psu_id
       ORDER BY u.Create_dt DESC`
    );
    const [departments] = await pool.execute(
      'SELECT DmdNo, DeptName FROM tbl_department ORDER BY DeptName ASC'
    );
    const [psus] = await pool.execute(
      'SELECT id, DmdNo, Psu_Name FROM tbl_psu_name ORDER BY Psu_Name ASC'
    );
    res.render('admin/users', {
      layout: 'layouts/dashboard',
      title: 'User Management',
      users,
      departments,
      psus,
      roleLabels: USER_ROLE_LABELS
    });
  } catch (err) {
    console.error('Error loading users:', err);
    res.status(500).send('Unable to load users.');
  }
};

// Create a new user (department / PSU / finance / SEC / admin).
exports.createUser = async (req, res) => {
  if (!ensureAdminUser(req, res)) return;
  try {
    let { Name, user_name, Password, Role, DmdNo, Psu_id } = req.body;
    Name = (Name || '').trim();
    user_name = (user_name || '').trim();
    Role = String(Role || '');
    DmdNo = (DmdNo || '').trim();
    Psu_id = Psu_id === '' || Psu_id == null ? 0 : Number(Psu_id);

    if (!Name) return res.status(400).json({ success: false, message: 'Name is required.' });
    if (!user_name || user_name.length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters.' });
    }
    if (!Password || Password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    if (!['1', '2', '3', '4', '5'].includes(Role)) {
      return res.status(400).json({ success: false, message: 'Invalid role selected.' });
    }
    // Department is required for Dept / PSU / SEC users.
    if (['2', '3', '5'].includes(Role) && !DmdNo) {
      return res.status(400).json({ success: false, message: 'Department is required for this role.' });
    }
    // A PSU user must be linked to a PSU under the chosen department.
    if (Role === '3') {
      if (!Psu_id) return res.status(400).json({ success: false, message: 'PSU is required for PSU users.' });
      const [psuRows] = await pool.execute(
        'SELECT id FROM tbl_psu_name WHERE id = ? AND DmdNo = ?',
        [Psu_id, DmdNo]
      );
      if (!psuRows || psuRows.length === 0) {
        return res.status(400).json({ success: false, message: 'Selected PSU does not belong to the chosen department.' });
      }
    } else {
      Psu_id = 0;
    }

    const [existing] = await pool.execute(
      'SELECT id FROM tbl_user WHERE user_name = ?',
      [user_name]
    );
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    await pool.execute(
      `INSERT INTO tbl_user
        (Psu_id, DmdNo, Name, user_name, Password, Role, Status, Create_dt, Modified_dt)
       VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [Psu_id, DmdNo, Name, user_name, hashedPassword, Role]
    );
    return res.json({ success: true, message: 'User created successfully.' });
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).json({ success: false, message: 'Unable to create user.' });
  }
};

// Activate / deactivate a user (admin cannot deactivate self).
exports.toggleUserStatus = async (req, res) => {
  if (!ensureAdminUser(req, res)) return;
  try {
    const { userId, status } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required.' });
    if (Number(userId) === Number(req.session.user.id)) {
      return res.status(400).json({ success: false, message: 'You cannot change your own status.' });
    }
    await pool.execute(
      'UPDATE tbl_user SET Status = ?, Modified_dt = NOW() WHERE id = ?',
      [Number(status) ? 1 : 0, userId]
    );
    return res.json({ success: true, message: 'User status updated.' });
  } catch (err) {
    console.error('Error updating user status:', err);
    return res.status(500).json({ success: false, message: 'Unable to update user status.' });
  }
};
