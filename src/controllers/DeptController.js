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
  const pendingYears = yearwiseData.filter(row => row.status === 1);
  const approvedYears = yearwiseData.filter(row => row.status === 3);
  const rejectedYears = yearwiseData.filter(row => row.status === 2);

  res.render('dept/dashboard', {
    layout: 'layouts/dashboard',
    title: 'PSU Dashboard',
    Psu_Name: req.session.user.Psu_Name,
    role: req.session.user.role,
    pendingYears,
    approvedYears,
    rejectedYears
    
  });
};

exports.getYearDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get Main Yearwise Record
    const [yearData] = await pool.execute(
      `SELECT * FROM tbl_psu_yearwise_mstr WHERE id = ?`,
      [id]
    );

    if (yearData.length === 0) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    const psuId = yearData[0].id;

    // 2️⃣ Get Related Tables
    const [balanceSheet] = await pool.execute(
      `SELECT * FROM tbl_balancesheet_indicator WHERE psu_mstr_id = ?`,
      [psuId]
    );

    const [incomeSheet] = await pool.execute(
      `SELECT * FROM tbl_income_sheet_indicator WHERE psu_mstr_id = ?`,
      [psuId]
    );

    const [govtRelation] = await pool.execute(
      `SELECT * FROM tbl_govt_relation WHERE psu_mstr_id = ?`,
      [psuId]
    );

    const [annualReport] = await pool.execute(
      `SELECT * FROM tbl_anual_report WHERE psu_mstr_id = ?`,
      [psuId]
    );

     // Render partial instead of JSON
    res.render('partials/psuYearDetails', {
      layout: false,
      data: {
        yearData: yearData[0],
        balanceSheet,
        incomeSheet,
        govtRelation,
        annualReport
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.approveRecord = async (req, res) => {
  const id = req.params.id;
  
  await pool.execute(
    `UPDATE tbl_psu_yearwise_mstr 
     SET status = 3 
     WHERE id = ?`,
    [id]
  );

  res.json({ success: true });
};

exports.rejectRecord = async (req, res) => {
  const id = req.params.id;
  const { reason } = req.body;

  await pool.execute(
    `UPDATE tbl_psu_yearwise_mstr 
     SET status = 2,
         reject_message = ?
     WHERE id = ?`,
    [reason, id]
  );

  res.json({ success: true });
};