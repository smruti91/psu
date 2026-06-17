const pool = require('../config/db');
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

  res.render('sec/dashboard', {
    layout: 'layouts/dashboard',
    title: 'PSU Dashboard',
    scripts:['getDeptData'],
    Psu_Name: req.session.user.Psu_Name,
    role: req.session.user.role,
    pendingYears,
    approvedYears,
    rejectedYears
    
  });
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