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
    scripts:['getDeptData'],
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

     const [profitLoss] = await pool.execute(
      `SELECT * FROM tbl_psu_profit_loss WHERE psu_mstr_id = ?`,
      [psuId]
    );

    const [annualReport] = await pool.execute(
      `SELECT * FROM tbl_anual_report WHERE psu_mstr_id = ?`,
      [psuId]
    );

console.log('Profit Loss:', profitLoss);
     // Render partial instead of JSON
    res.render('partials/psuYearDetails', {
      layout: false,
      data: {
        yearData: yearData[0],
        balanceSheet,
        incomeSheet,
        govtRelation,
        annualReport,
        profitLoss,
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

exports.getPendingProfile = async(req, res)=>{
   const dmdNo = req.session.user.dmdNo;
   const [pendingData] = await pool.execute(
      `SELECT p.*, n.Psu_Name  FROM tbl_psu_profile as p join tbl_psu_name n on p.psu_id = n.id WHERE dmd_no = ? and status = ? `,
      [dmdNo, 2]
    );

   res.render('dept/pendingProfile', {
    layout: 'layouts/dashboard',
    title: 'PSU Dashboard',
    scripts:['getDeptData'],
    Psu_Name: req.session.user.Psu_Name,
    approvals: pendingData,
    
    
  }); 

}
exports.getApproveProfile = async(req, res)=>{
  const dmdNo = req.session.user.dmdNo;
   const [approvedData] = await pool.execute(
      `SELECT p.*, n.Psu_Name  FROM tbl_psu_profile as p join tbl_psu_name n on p.psu_id = n.id WHERE dmd_no = ? and status > ? `,
      [dmdNo, 3]
    );

  res.render('dept/approvedProfile', {
    layout: 'layouts/dashboard',
    title: 'PSU Dashboard',
    scripts:['getDeptData'],
    Psu_Name: req.session.user.Psu_Name,
    approved: approvedData,
    
    
  }); 
}

exports.getRejectedProfile = async(req, res)=>{
  const dmdNo = req.session.user.dmdNo;
   const [rejecteddData] = await pool.execute(
      `SELECT p.*, n.Psu_Name  FROM tbl_psu_profile as p join tbl_psu_name n on p.psu_id = n.id WHERE dmd_no = ? and status = ? `,
      [dmdNo, 3]
    );

  res.render('dept/rejectedProfile', {
    layout: 'layouts/dashboard',
    title: 'PSU Dashboard',
    scripts:['getDeptData'],
    Psu_Name: req.session.user.Psu_Name,
    rejected: rejecteddData,
    
    
  }); 
}

exports.approveProfile = async(req, res)=>{
  try {

        const { profileId } = req.body;

     

        await pool.execute(
            `UPDATE tbl_psu_profile
             SET status = ?
             WHERE id = ?`,
            [4, profileId]
        );

        res.json({
            success: true,
            message: 'Sent for approval'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.rejectProfile = async(req, res)=>{
  try {

        const { profileId, remarks } = req.body;

     

        await pool.execute(
            `UPDATE tbl_psu_profile
             SET status = ?, remarks = ?
             WHERE id = ?`,
            [3, remarks, profileId]
        );

        res.json({
            success: true,
            message: 'Sent for approval'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.updateField = async (req, res) => {
console.log(req.body);
    const {
        table,
        recordId,
        field,
        value,
        psuMstrId
    } = req.body;

    const userId = req.session.user.id;

    const [oldRecord] = await pool.execute(
        `SELECT ${field}
         FROM ${table}
         WHERE id = ?`,
        [recordId]
    );
   console.log(oldRecord);
    const oldValue = oldRecord[0][field];

    await pool.execute(
        `UPDATE ${table}
         SET ${field} = ?
         WHERE id = ?`,
        [value, recordId]
    );

    await pool.execute(
        `INSERT INTO tbl_t_data_log
        (
            table_name,
            psu_mstr_id,
            record_id,
            field_name,
            old_value,
            new_value,
            changed_by,
            ip_address
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            table,
            psuMstrId,
            recordId,
            field,
            oldValue,
            value,
            userId,
            req.ip
        ]
    );

    res.json({
        success: true
    });
};

exports.transationHistory = async(req, res)=>{
    try {

         const { id } = req.params;

        const [rows] = await pool.execute(`
        SELECT
            l.*,
            u.name AS user_name
        FROM tbl_t_data_log l
        LEFT JOIN tbl_user u
            ON u.id = l.changed_by
        WHERE l.psu_mstr_id = ?
        ORDER BY
            u.name,
            l.table_name,
            l.changed_at DESC
    `,[id]);

    const grouped = {};

    rows.forEach(row => {

        if (!grouped[row.user_name]) {
            grouped[row.user_name] = {};
        }

        if (!grouped[row.user_name][row.table_name]) {
            grouped[row.user_name][row.table_name] = [];
        }

        grouped[row.user_name][row.table_name].push(row);

    });

    res.render('partials/transaction-history', {
      layout: false,
        grouped
    });

        // const [auditLogs] = await pool.execute(`
        //     SELECT
        //         a.*,
        //         u.name AS changed_by_name
        //     FROM tbl_t_data_log a
        //     LEFT JOIN tbl_user u
        //         ON u.id = a.changed_by
        //     WHERE a.psu_mstr_id = ?
        //     ORDER BY a.changed_at DESC
        // `,[id]);

        // res.render('partials/transaction-history', {
        //     layout: false,
        //     auditLogs,
        //     id
        // });

        

    } catch(err) {

        console.error(err);

        res.status(500).send('Server Error');
    }
}