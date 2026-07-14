const router = require('express').Router();
const DeptController = require('../controllers/DeptController');
const FinanceController = require('../controllers/FinanceController');
const { ensureAuth } = require('../middlewares/auth');
const { upload } = require('../../app');
const csrf = require('csurf');
const csrfProtection = csrf();
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

// Set user in res.locals for all routes in this router
router.use(FinanceController.setUserLocals);
router.get('/', ensureAuth, FinanceController.dashboard);
router.get('/pending-profile', FinanceController.getPendingProfile);
router.get('/psu-names', ensureAuth, FinanceController.getPsuNames);
router.get('/finYr-report', ensureAuth, FinanceController.getFinYrReport)
router.get('/finyear-report', ensureAuth, FinanceController.getFinYearReport)
router.get('/report', async (req, res) => {
    const { finYr, dmdNo, psuId } = req.query;
   
    let reportData = [];
    
    //fetch data based on finYr, dmdNo, psuId if provided 
    let query = `SELECT 
                  m.id,
                  p.Psu_Name,
                  m.Auth_Share_Capital,
                  m.Paid_Share_Capital,
                  m.Govt_Contri_Amt,
                  pl.PAT,
                  pl.Dividend_Payable,
                  pl.Dividend_Paid,
                  m.FinYr
                FROM tbl_psu_yearwise_mstr AS m
                JOIN tbl_psu_profit_loss AS pl ON  m.id = pl.psu_mstr_id
                JOIN tbl_user AS u ON m.user_id = u.id
                JOIN tbl_psu_name AS p ON u.psu_id = p.id
                WHERE 1 = 1`;
    const params = []; 
    if (finYr) {
      query += ' AND m.FinYr = ?';
      params.push(finYr);
    }
    if (dmdNo) {
      query += ' AND m.DmdNo = ?';
      params.push(dmdNo);
    }
    if (psuId) {
      query += ' AND p.id = ?';
      params.push(psuId);
    }
    const [rows] = await pool.execute(query, params);
    // console.log('SQL:', query);
    // console.log('PARAMS:', params);
    // console.log('Fetched Rows:', rows);
    if (rows && rows.length > 0) {
      reportData = rows;
    }
  
    res.json(reportData);
});

router.get('/report/excel', ensureAuth, FinanceController.downloadReportExcel);
// router.get('/report/pdf', ensureAuth, FinanceController.downloadReportPdf);
module.exports = router;