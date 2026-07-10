const router = require('express').Router();
const PsuController = require('../controllers/PsuController');
const { ensureAuth, ensureAdmin } = require('../middlewares/auth');
const { validateYearWiseData } = require('../middlewares/psuValidation');
const { validatePsuProfile } = require('../middlewares/psuProfileValidation');
const { upload } = require('../../app');
const csrf = require('csurf');
const csrfProtection = csrf();
const fs = require('fs');
const path = require('path');

// Set user in res.locals for all routes in this router
router.use(PsuController.setUserLocals);

// --- Balance Sheet (Step 2) ---
router.get('/balance-sheet', ensureAuth, PsuController.getBalanceSheet);
router.post('/balance-sheet', ensureAuth,upload.none(), PsuController.submitBalanceSheet);
router.post('/balance-sheet-update', ensureAuth,upload.none(), PsuController.updateBalanceSheet);

// --- Income Statement (Step 3) ---
router.get('/income-statement', ensureAuth, PsuController.getIncomeStatement);
router.post('/income-statement', ensureAuth,upload.none(), PsuController.submitIncomeStatement);
router.post('/income-statement-update', ensureAuth,upload.none(), PsuController.updateIncomeStatement);

// --- Govt. Relationship (Step 4) ---
router.get('/govt-rel', ensureAuth, PsuController.getGovtRel);
router.post('/govt-rel', ensureAuth,upload.none(), PsuController.submitGovtRel);
router.post('/govt-rel-update', ensureAuth,upload.none(), PsuController.updateGovtRel);

// --- PSU Profile ---
router.post('/psu-profile', ensureAuth, upload.any(), validatePsuProfile, PsuController.submitPsuProfile);
router.post('/delete-roc-document', ensureAuth, csrfProtection, PsuController.deleteRocDocument);
router.get('/get-shareholders/:profileId', ensureAuth, PsuController.getShareholdersByProfileId);
router.post('/profile-approval', ensureAuth, PsuController.approvePsuProfile);

// --- Annual Report Upload (Step 5) ---
router.get('/annual-report', ensureAuth, PsuController.getAnnualReport);
router.post('/annual-report', ensureAuth, upload.single('annual_report'),csrfProtection, PsuController.submitAnnualReport);
router.post('/annual-report-update', ensureAuth, upload.single('annual_report'),csrfProtection, PsuController.updateAnnualReport);
router.post('/annual-report-delete', ensureAuth, PsuController.deleteAnnualReport);
router.post('/send-for-approval', ensureAuth, PsuController.sendForApproval);

// profit loss 
router.post('/profit-loss', ensureAuth, upload.array('chaln_recipt', 10),csrfProtection, PsuController.submitPrfitLoss);
// Update route for Year Wise Data
router.post('/year-wise-data-update',
  upload.array('chaln_recipt', 10),  validateYearWiseData, PsuController.updateYearWiseData);

router.get('/', ensureAuth, PsuController.dashboard);

// POST route for Year Wise Data form
router.post('/year-wise-data',
  upload.none(), 
  csrfProtection,
  PsuController.submitYearWiseData);

router.post('/delete-challan-file', async (req, res) => {
    const id = req.body.id;
    const fileIndex = req.body.fileIndex; // Optional - for deleting specific file from list
    const pool = require('../config/db');
    const selectQuery = `SELECT chaln_recipt FROM tbl_psu_yearwise_mstr WHERE id = ?`;
    const [rows] = await pool.execute(selectQuery, [id]);
    const record = rows && rows.length > 0 ? rows[0] : null;

    if (!record || !record.chaln_recipt) {
        return res.json({ success: false, message: 'No file found.' });
    }

    const files = record.chaln_recipt.split(',').map(f => f.trim()).filter(f => f);

    // If fileIndex provided, delete specific file from the list
    if (fileIndex !== undefined && fileIndex !== null) {
        const idx = parseInt(fileIndex, 10);
        if (idx >= 0 && idx < files.length) {
            const fileToDelete = files[idx];
            const filePath = path.join(process.cwd(), fileToDelete);

            // Delete physical file
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Remove from array and update database
            files.splice(idx, 1);
            const newFileList = files.join(',');
            const updateQuery = newFileList
                ? `UPDATE tbl_psu_yearwise_mstr SET chaln_recipt = ? WHERE id = ?`
                : `UPDATE tbl_psu_yearwise_mstr SET chaln_recipt = NULL WHERE id = ?`;

            const updateValues = newFileList ? [newFileList, id] : [id];
            const [updateResult] = await pool.execute(updateQuery, updateValues);

            if (updateResult.affectedRows > 0) {
                return res.json({ success: true });
            }
        }
        return res.json({ success: false, message: 'Invalid file index.' });
    }

    // Otherwise, delete all files (original behavior)
    files.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });

    const updateQuery = `UPDATE tbl_psu_yearwise_mstr SET chaln_recipt = NULL WHERE id = ?`;
    const [updateResult] = await pool.execute(updateQuery, [id]);

    if (updateResult.affectedRows > 0) {
        return res.json({ success: true });
    }

    return res.json({ success: false });
});
router.post('/year-wise-form', ensureAuth, PsuController.getYearWiseForm);
router.get('/view-data', ensureAuth, PsuController.viewPsuData); 
router.get('/view-data-yearwise', ensureAuth, PsuController.viewPsuDataYearwise);
router.get('/profile', ensureAuth, PsuController.profile);



// Get yearwise data for dropdown selection (AJAX)
router.get('/yearwise', ensureAuth, async (req, res) => {
  const { dmdNo, psuName, finYr } = req.query;
  let yearWiseData = null;

  if (!dmdNo || !psuName || !finYr) return res.json({});
  try {
    const pool = require('../config/db');
    const [rows] = await pool.execute(
      'SELECT * FROM tbl_psu_yearwise_mstr WHERE DmdNo = ? AND Psu_Name = ? AND FinYr = ? LIMIT 1',
      [dmdNo, psuName, finYr]
    );
    if (rows && rows.length > 0){
      yearWiseData = rows[0];

      return res.json({YearWiseData: {"id": yearWiseData.id,"Psu Name": yearWiseData.Psu_Name, "Auth Share Capital": yearWiseData.Auth_Share_Capital, "Sub Share Capital": yearWiseData.Sub_Share_Capital, "Paid Share Capital": yearWiseData.Paid_Share_Capital, "Govt Contri Amt": yearWiseData.Govt_Contri_Amt, "Govt Contri Percent": yearWiseData.Govt_Contri_Percent, "Name Of Share Holder": yearWiseData.NameOf_Share_Holder, "Profit Loss": yearWiseData.Profit_Loss, "PAT": yearWiseData.PAT, "Dividend Payable": yearWiseData.Dividend_Payable, "Dividend_Paid": yearWiseData.Dividend_Paid}});
    }else{
     return res.json({});
    }
  
  } catch (err) {
    //console.error('Error fetching yearwise:', err);
    return res.status(500).json({});
  }
});

module.exports = router;
