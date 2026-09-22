const pool = require('../config/db');
const { PROFILE_STATUS } = require('../utils/profileStatus');
const profileHistoryService = require('../services/profileHistoryService');
exports.setUserLocals = (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  next();
};

exports.dashboard = async (req, res) => {
  console.log('Session data:', req.session.user);
  
  const userId = req.session.user.id;
  const role = req.session.user.role;
  
  const dmdNo = req.session.user.dmdNo;
  const [yearwiseData] = await pool.execute(
        `SELECT * FROM tbl_psu_yearwise_mstr WHERE DmdNo = ?`,
        [dmdNo]
      );
  const pendingYears = yearwiseData.filter(row => row.status === 3);
  const approvedYears = yearwiseData.filter(row => row.status === 5);
  const rejectedYears = yearwiseData.filter(row => row.status === 4);

  // Profiles awaiting SEC approval (status 3) for this department - dashboard notification.
  const [pendingProfiles] = await pool.execute(
        `SELECT p.id, p.created_at, n.Psu_Name
         FROM tbl_psu_profile p
         JOIN tbl_psu_name n ON p.psu_id = n.id
         WHERE p.dmd_no = ? AND p.status = ?
         ORDER BY p.created_at DESC`,
        [dmdNo, PROFILE_STATUS.PENDING_SEC]
      );

  res.render('sec/dashboard', {
    layout: 'layouts/dashboard',
    title: 'PSU Dashboard',
    scripts:['getDeptData'],
    Psu_Name: req.session.user.Psu_Name,
    role: req.session.user.role,
    pendingYears,
    approvedYears,
    rejectedYears,
    pendingProfiles
    
  });
};
exports.profile = async (req, res) => {
  const dmdNo = req.session.user.dmdNo;
  const [approvedData] = await pool.execute(
      `SELECT p.*, n.Psu_Name  FROM tbl_psu_profile as p join tbl_psu_name n on p.psu_id = n.id WHERE dmd_no = ? and status = ? `,
      [dmdNo, PROFILE_STATUS.APPROVED]
    );

  res.render('sec/Profile_sec', {
    layout: 'layouts/dashboard',
    title: 'PSU Profile',
    scripts: ['getDeptData'],
    approved: approvedData
  });
};

// SEC pending queue: profiles waiting for SEC approval (status 3).
exports.getPendingProfile = async (req, res) => {
  const dmdNo = req.session.user.dmdNo;
  const [profiles] = await pool.execute(
      `SELECT p.*, n.Psu_Name
       FROM tbl_psu_profile p
       JOIN tbl_psu_name n ON p.psu_id = n.id
       WHERE p.dmd_no = ? AND p.status = ?`,
      [dmdNo, PROFILE_STATUS.PENDING_SEC]
    );

  const [shareholders] = await pool.execute(
      `SELECT profile_id, shareholder_name, shareholder_percent
       FROM tbl_psu_shareholders
       ORDER BY profile_id, id`
    );

  const shareholderMap = {};
  shareholders.forEach(row => {
    if (!shareholderMap[row.profile_id]) shareholderMap[row.profile_id] = [];
    shareholderMap[row.profile_id].push(row);
  });
  profiles.forEach(profile => {
    profile.shareholders = shareholderMap[profile.id] || [];
  });

  res.render('dept/pendingProfile', {
    layout: 'layouts/dashboard',
    title: 'PSU Profile - Pending at SEC',
    scripts: ['getDeptData'],
    Psu_Name: req.session.user.Psu_Name,
    approvals: profiles
  });
};

// SEC approval: Pending-at-SEC (3) -> Approved (5).
exports.approveProfile = async (req, res) => {
  try {
    if (String(req.session?.user?.role || '') !== '5') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    const { profileId } = req.body;
    if (!profileId) {
      return res.status(400).json({ success: false, message: 'Profile ID is required.' });
    }

    const [rows] = await pool.execute(
      'SELECT status FROM tbl_psu_profile WHERE id = ?',
      [profileId]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }
    if (Number(rows[0].status) !== PROFILE_STATUS.PENDING_SEC) {
      return res.status(400).json({ success: false, message: 'Only profiles pending at SEC can be approved.' });
    }

    await pool.execute(
      `UPDATE tbl_psu_profile SET status = ?, updated_at = NOW() WHERE id = ?`,
      [PROFILE_STATUS.APPROVED, profileId]
    );

    await profileHistoryService.logProfileTransition(
      profileId, 'APPROVE_SEC', req.session?.user?.id
    );

    res.json({ success: true, message: 'Profile approved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// SEC rejection: Pending-at-SEC (3) -> Rejected-by-SEC (4).
exports.rejectProfile = async (req, res) => {
  try {
    if (String(req.session?.user?.role || '') !== '5') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    const { profileId, remarks } = req.body;
    if (!profileId) {
      return res.status(400).json({ success: false, message: 'Profile ID is required.' });
    }
    if (!remarks || !String(remarks).trim()) {
      return res.status(400).json({ success: false, message: 'Rejection remarks are required.' });
    }

    const [rows] = await pool.execute(
      'SELECT status FROM tbl_psu_profile WHERE id = ?',
      [profileId]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }
    if (Number(rows[0].status) !== PROFILE_STATUS.PENDING_SEC) {
      return res.status(400).json({ success: false, message: 'Only profiles pending at SEC can be rejected.' });
    }

    await pool.execute(
      `UPDATE tbl_psu_profile SET status = ?, remark = ?, updated_at = NOW() WHERE id = ?`,
      [PROFILE_STATUS.REJECTED_SEC, remarks, profileId]
    );

    await profileHistoryService.logProfileTransition(
      profileId, 'REJECT_SEC', req.session?.user?.id
    );

    res.json({ success: true, message: 'Profile rejected and sent back to PSU.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.approveRecord = async (req, res) => {
  const id = req.params.id;
  
  await pool.execute(
    `UPDATE tbl_psu_yearwise_mstr 
     SET status = 5 
     WHERE id = ?`,
    [id]
  );

  res.json({ success: true });
};