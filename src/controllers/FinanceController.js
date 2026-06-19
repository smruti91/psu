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
    let DemantData = null;
    const [rows] = await pool.execute(
      `SELECT * FROM tbl_department order BY DmdNo ASC`
    );
    if (rows && rows.length > 0) {
      DemantData = rows;
    }
    res.render('finance/dashboard', {
      layout: 'layouts/dashboard',
        title: 'Finance Dashboard',
        scripts:['getFinData'],
        role: req.session.user.role,
        DemantData: DemantData
    });
};

exports.getFinYrReport = async(req, res)=>{
    let DemandData = null;
    const [rows] = await pool.execute(
      `SELECT * FROM tbl_department order BY DmdNo ASC`
    );
    if (rows && rows.length > 0) {
      DemandData = rows;
    }
    res.render('finance/finYrReport', {
        layout: 'layouts/dashboard',
        title: 'Financial Year',
        scripts:['getFinData'],
        DemandData: DemandData
    });
}
exports.getFinYearReport = async(req, res)=>{
  try {

        const { dmdNo, psuId } = req.query;

        let query = `
            SELECT
                p.id AS psu_id,
                p.Psu_Name,
                m.FinYr,
                m.Govt_Contri_Amt,
                pl.PAT,
                pl.Dividend_Paid
            FROM tbl_psu_yearwise_mstr m
            INNER JOIN tbl_psu_profit_loss pl
                ON m.id = pl.psu_mstr_id
            INNER JOIN tbl_user u
                ON m.user_id = u.id
            INNER JOIN tbl_psu_name p
                ON u.psu_id = p.id
            WHERE 1=1
        `;

        const params = [];

        if (dmdNo) {
            query += ` AND m.DmdNo = ?`;
            params.push(dmdNo);
        }

        if (psuId) {
            query += ` AND p.id = ?`;
            params.push(psuId);
        }

        query += `
            ORDER BY
            p.Psu_Name,
            m.FinYr
        `;

        const [rows] = await pool.execute(query, params);

        res.json(rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
exports.getPsuNames = async (req, res) => {
  const dmdNo = req.query.dmdNo;
  let psuNames = [];

  if (!dmdNo) {
    return res.json({ PsuNames: [] });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT *FROM tbl_psu_name WHERE DmdNo = ?`,
      [dmdNo]
    );
    if (rows && rows.length > 0) {
      psuNames = rows;
    }
    res.json({ PsuNames: psuNames });
  } catch (err) {
    console.error('Error fetching PSU names:', err);
    res.status(500).json({ PsuNames: [] });
  }
};

exports.downloadReportExcel = async (req, res) => {
  // Implement logic to generate and send Excel report
 const { finYr, dmdNo, psuId } = req.query;
  const pool = require('../config/db');
  const ExcelJS = require('exceljs');

  let query = `
    SELECT 
      p.Psu_Name,
      m.Auth_Share_Capital,
      m.Paid_Share_Capital,
      m.Govt_Contri_Amt,
      m.PAT,
      m.Dividend_Payable,
      m.Dividend_Paid,
      m.FinYr
    FROM tbl_psu_yearwise_mstr m
    JOIN tbl_user u ON m.user_id = u.id
    JOIN tbl_psu_name p ON u.psu_id = p.id
    WHERE 1=1
  `;
  const params = [];

  if (finYr) { query += ' AND m.FinYr = ?'; params.push(finYr); }
  if (dmdNo) { query += ' AND m.DmdNo = ?'; params.push(dmdNo); }
  if (psuId) { query += ' AND p.id = ?'; params.push(psuId); }

  const [rows] = await pool.execute(query, params);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('PSU Report');

  sheet.columns = [
    { header: 'Sl No', key: 'sl', width: 8 },
    { header: 'PSU Name', key: 'Psu_Name', width: 25 },
    { header: 'Auth Share Capital', key: 'Auth_Share_Capital' },
    { header: 'Paid Share Capital', key: 'Paid_Share_Capital' },
    { header: 'Govt Contribution', key: 'Govt_Contri_Amt' },
    { header: 'PAT', key: 'PAT' },
    { header: 'Dividend Payable', key: 'Dividend_Payable' },
    { header: 'Dividend Paid', key: 'Dividend_Paid' },
    { header: 'Financial Year', key: 'FinYr' }
  ];
// Add rows with SL No
rows.forEach((row, index) => {
  sheet.addRow({
    sl: index + 1,
    ...row
  });
});

  //sheet.addRows(rows);

  res.setHeader(
    'Content-Disposition',
    'attachment; filename=psu_report.xlsx'
  );
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  await workbook.xlsx.write(res);
  res.end();
};

