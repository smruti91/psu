const fs = require('fs');
const path = require('path');
exports.setUserLocals = (req, res, next) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  next();
};
// --- Income Statement (Step 3) ---
// Fetch Income Statement data for a given psu_mstr_id
exports.getIncomeStatement = async (req, res) => {
  const psu_mstr_id = req.query.psu_mstr_id;
  let IncomeSheetData = null;
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM tbl_income_sheet_indicator WHERE psu_mstr_id = ? LIMIT 1`,
      [psu_mstr_id]
    );
    if (rows && rows.length > 0) {
      IncomeSheetData = rows[0];
    }
  } catch (err) {
    console.error('Error fetching income statement:', err);
  }
  res.json({IncomeSheetData: {"Total Revenue": IncomeSheetData.tot_revenue, "Cost of goods sold": IncomeSheetData.cost_ofgoods_sold, "Operating Expenses": IncomeSheetData.operating_expenses, "Total Expenses": IncomeSheetData.tot_expenses, "Ebitda": IncomeSheetData.ebitda, "Depriciation & Amortization": IncomeSheetData.depreciation, "Ebit (Operating Profit)": IncomeSheetData.ebit_operating, "Interest Expenses": IncomeSheetData.int_expenses, "Tax Expenses": IncomeSheetData.tax_expenses, "Any Other Expenses": IncomeSheetData.any_other_expenses, "Net Income": IncomeSheetData.net_income}});
};

// Insert Income Statement data
exports.submitIncomeStatement = async (req, res) => {
  console.log('Received Income Statement data:', req.body);
  const {
    tot_revenue,
    cost_ofgoods_sold,
    operating_expenses,
    tot_expenses,
    ebitda,
    depreciation,
    ebit_operating,
    int_expenses,
    tax_expenses,
    any_other_expenses,
    net_income,
    psu_mstr_id
  } = req.body;

  // Validate psu_mstr_id
  if (!psu_mstr_id) {
    return res.status(400).json({ errors: [{ msg: 'Please save Year Wise Data first (Step 1).' }] });
  }

  try {
    // Check if record already exists
    const [existing] = await pool.execute(
      'SELECT id FROM tbl_income_sheet_indicator WHERE psu_mstr_id = ?',
      [psu_mstr_id]
    );

    if (existing && existing.length > 0) {
      // Update existing record
      const updateQuery = `UPDATE tbl_income_sheet_indicator SET
        tot_revenue=?, cost_ofgoods_sold=?, operating_expenses=?, tot_expenses=?,
        ebitda=?, depreciation=?, ebit_operating=?, int_expenses=?, tax_expenses=?,
        any_other_expenses=?, net_income=?, updated_at=NOW()
        WHERE psu_mstr_id=?`;
      const updateValues = [
        tot_revenue, cost_ofgoods_sold, operating_expenses, tot_expenses,
        ebitda, depreciation, ebit_operating, int_expenses, tax_expenses,
        any_other_expenses, net_income, psu_mstr_id
      ];
      await pool.execute(updateQuery, updateValues);
      return res.json({ success: true, message: 'Income Statement updated successfully!' });
    }

    const insertQuery = `INSERT INTO tbl_income_sheet_indicator
      (tot_revenue, cost_ofgoods_sold, operating_expenses, tot_expenses, ebitda, depreciation, ebit_operating, int_expenses, tax_expenses, any_other_expenses, net_income, psu_mstr_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const insertValues = [
      tot_revenue, cost_ofgoods_sold, operating_expenses, tot_expenses,
      ebitda, depreciation, ebit_operating, int_expenses, tax_expenses,
      any_other_expenses, net_income, psu_mstr_id
    ];
    const [result] = await pool.execute(insertQuery, insertValues);
    return res.json({ success: true, message: 'Income Statement saved successfully!', id: result.insertId });
  } catch (err) {
    console.error('DB Insert Error (Income Statement):', err);
    return res.status(500).json({ errors: [{ msg: 'Database error: ' + err.message }] });
  }
};

// Update Income Statement data
exports.updateIncomeStatement = async (req, res) => {
  const {
    incomeSheetId,
    tot_revenue,
    cost_ofgoods_sold,
    operating_expenses,
    tot_expenses,
    ebitda,
    depreciation,
    ebit_operating,
    int_expenses,
    tax_expenses,
    any_other_expenses,
    net_income,
    psu_mstr_id
  } = req.body;
  try {
    const updateQuery = `UPDATE tbl_income_sheet_indicator SET 
      tot_revenue=?, cost_ofgoods_sold=?, operating_expenses=?, tot_expenses=?, ebitda=?, depreciation=?, ebit_operating=?, int_expenses=?, tax_expenses=?, any_other_expenses=?, net_income=?, psu_mstr_id=?, updated_at=NOW()
      WHERE id=?`;
    const updateValues = [
      tot_revenue,
      cost_ofgoods_sold,
      operating_expenses,
      tot_expenses,
      ebitda,
      depreciation,
      ebit_operating,
      int_expenses,
      tax_expenses,
      any_other_expenses,
      net_income,
      psu_mstr_id,
      incomeSheetId
    ];
    await pool.execute(updateQuery, updateValues);
    return res.json({ success: true, message: 'Income Statement updated successfully!' });
  } catch (err) {
    console.error('DB Update Error (Income Statement):', err);
    return res.status(500).json({ errors: [{ msg: 'Database error. Please try again.' }] });
  }
};

// --- Govt. Relationship (Step 4) ---
// Fetch Govt. Relationship data for a given psu_mstr_id
exports.getGovtRel = async (req, res) => {
  const psu_mstr_id = req.query.psu_mstr_id;
  let govtRelData = null;
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM tbl_govt_relation WHERE psu_mstr_id = ? LIMIT 1`,
      [psu_mstr_id]
    );
    if (rows && rows.length > 0) {
      govtRelData = rows[0];
    }
  } catch (err) {
    console.error('Error fetching govt rel:', err);
  }
  res.json({govtRelData: {"Direct Budget Subsidies": govtRelData.direct_bud_subsidies, "Tax and state dues": govtRelData.tax_and_state_dues}});
};

// Insert Govt. Relationship data
exports.submitGovtRel = async (req, res) => {
  const {
    direct_bud_subsidies,
    tax_and_state_dues,
    psu_mstr_id
  } = req.body;

  console.log('Received Govt. Relationship data:', req.body);

  // Validate psu_mstr_id
  if (!psu_mstr_id) {
    return res.status(400).json({ errors: [{ msg: 'Please save Year Wise Data first (Step 1).' }] });
  }

  try {
    // Check if record already exists
    const [existing] = await pool.execute(
      'SELECT id FROM tbl_govt_relation WHERE psu_mstr_id = ?',
      [psu_mstr_id]
    );

    if (existing && existing.length > 0) {
      // Update existing record
      const updateQuery = `UPDATE tbl_govt_relation SET
        direct_bud_subsidies=?, tax_and_state_dues=?, updated_at=NOW()
        WHERE psu_mstr_id=?`;
      await pool.execute(updateQuery, [direct_bud_subsidies, tax_and_state_dues, psu_mstr_id]);
      return res.json({ success: true, message: 'Govt. Relationship updated successfully!' });
    }

    const insertQuery = `INSERT INTO tbl_govt_relation
      (direct_bud_subsidies, tax_and_state_dues, psu_mstr_id, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())`;
    const insertValues = [
      direct_bud_subsidies,
      tax_and_state_dues,
      psu_mstr_id
    ];
    const [result] = await pool.execute(insertQuery, insertValues);
    return res.json({ success: true, message: 'Govt. Relationship saved successfully!', id: result.insertId });
  } catch (err) {
    console.error('DB Insert Error (Govt Rel):', err);
    return res.status(500).json({ errors: [{ msg: 'Database error: ' + err.message }] });
  }
};

// Update Govt. Relationship data
exports.updateGovtRel = async (req, res) => {
  const {
    govtRelId,
    direct_bud_subsidies,
    tax_and_state_dues,
    psu_mstr_id
  } = req.body;
  try {
    const updateQuery = `UPDATE tbl_govt_relation SET 
      direct_bud_subsidies=?, tax_and_state_dues=?, psu_mstr_id=?, updated_at=NOW()
      WHERE id=?`;
    const updateValues = [
      direct_bud_subsidies,
      tax_and_state_dues,
      psu_mstr_id,
      govtRelId
    ];
    await pool.execute(updateQuery, updateValues);
    return res.json({ success: true, message: 'Govt. Relationship updated successfully!' });
  } catch (err) {
    console.error('DB Update Error (Govt Rel):', err);
    return res.status(500).json({ errors: [{ msg: 'Database error. Please try again.' }] });
  }
};

// --- Annual Report Upload (Step 5) ---
// Submit Annual Report
exports.submitAnnualReport = async (req, res) => {
  const {
    psu_mstr_id
  } = req.body;

  // Check if file exists
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select a PDF file to upload.' });
  }

  // Validate file type (PDF only)
  if (req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ success: false, message: 'Only PDF files are allowed.' });
  }

  // Validate file size (max 5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (req.file.size > MAX_FILE_SIZE) {
    return res.status(400).json({ success: false, message: 'File size should not exceed 5MB.' });
  }

  console.log('Received Annual Report upload:', req.body, req.file);
  
  try {
    const user_id = req.session.user.id;
    const psu_id = req.session.user.psu_id;
    
    // Get DmdNo from psu_mstr_id
    const [psuData] = await pool.execute(
      `SELECT DmdNo FROM tbl_psu_yearwise_mstr WHERE id = ?`,
      [psu_mstr_id]
    );
    
    if (!psuData || psuData.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid PSU Master ID.' });
    }
    
    const DmdNo = psuData[0].DmdNo;
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const filePath = `public/uploads/annual-reports/${fileName}`;

    // Save file to filesystem (store relative path)
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(__dirname, '../../public/uploads/annual-reports');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(uploadDir, fileName), req.file.buffer);

    const insertQuery = `INSERT INTO tbl_anual_report 
      (user_id, psu_id, DmdNo, psu_mstr_id, annual_report, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
    const insertValues = [
      user_id,
      psu_id,
      DmdNo,
      psu_mstr_id,
      filePath
    ];
    
    const [result] = await pool.execute(insertQuery, insertValues);
    return res.json({ 
      success: true, 
      message: 'Annual Report uploaded successfully!', 
      id: result.insertId,
      filePath: filePath 
    });
  } catch (err) {
    console.error('Error uploading annual report:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Database error. Please try again.' 
    });
  }
};

//delete annual report
exports.deleteAnnualReport = async (req, res) => { 
  const { id } = req.body;
  try {
    // Get file path to delete    
    const [data] = await pool.execute(
      `SELECT annual_report FROM tbl_anual_report WHERE id = ?`, 
      [id]    );
      console.log('Data fetched for deletion:', data[0]);
    if (data && data.length > 0 && data[0].annual_report) {
      const filePath = path.join(__dirname, '../../', data[0].annual_report);
      console.log('File path to delete:', filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    const deleteQuery = `DELETE FROM tbl_anual_report WHERE id = ?`;
    await pool.execute(deleteQuery, [id]);
     res.json({ success: true, message: 'Annual Report deleted successfully!' });
  } catch (err) {
    console.error('Error deleting annual report:', err);
     res.status(500).json({ success: false, message: 'Database error. Please try again.' });
  }
}

// Update Annual Report
exports.updateAnnualReport = async (req, res) => {
  const {
    annualReportId,
    psu_mstr_id
  } = req.body;

  // Check if file exists
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select a PDF file to upload.' });
  }

  // Validate file type (PDF only)
  if (req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ success: false, message: 'Only PDF files are allowed.' });
  }

  // Validate file size (max 5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (req.file.size > MAX_FILE_SIZE) {
    return res.status(400).json({ success: false, message: 'File size should not exceed 5MB.' });
  }

  console.log('Updating Annual Report:', req.body, req.file);
  
  try {
    // Get old file path to delete
    const [oldData] = await pool.execute(
      `SELECT annual_report FROM tbl_anual_report WHERE id = ?`,
      [annualReportId]
    );

    const fileName = `${Date.now()}_${req.file.originalname}`;
    const filePath = `public/uploads/annual-reports/${fileName}`;

    // Save new file to filesystem
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(__dirname, '../../public/uploads/annual-reports');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(uploadDir, fileName), req.file.buffer);

    // Delete old file if it exists
    if (oldData && oldData.length > 0 && oldData[0].annual_report) {
      const oldFilePath = path.join(__dirname, '../../', oldData[0].annual_report);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const updateQuery = `UPDATE tbl_anual_report SET 
      annual_report=?, updated_at=NOW()
      WHERE id=?`;
    const updateValues = [filePath, annualReportId];
    
    await pool.execute(updateQuery, updateValues);
    return res.json({ 
      success: true, 
      message: 'Annual Report updated successfully!',
      filePath: filePath 
    });
  } catch (err) {
    console.error('Error updating annual report:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Database error. Please try again.' 
    });
  }
};

// Fetch Annual Report data
exports.getAnnualReport = async (req, res) => {
  const psu_mstr_id = req.query.psu_mstr_id;
  let annualReportData = null;
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM tbl_anual_report WHERE psu_mstr_id = ? LIMIT 1`,
      [psu_mstr_id]
    );
    if (rows && rows.length > 0) {
      annualReportData = rows[0];
    }
  } catch (err) {
    console.error('Error fetching annual report:', err);
  }
  res.json({ annualReportData });
};

// Send for approval (marks yearwise record as submitted)
exports.sendForApproval = async (req, res) => {
  const { psu_mstr_id } = req.body;
  if (!psu_mstr_id) return res.status(400).json({ success: false, message: 'Missing psu_mstr_id' });
  try {
    // Try to set a submitted timestamp on the yearwise master record.
    // If your DB schema uses a different column name, update this query accordingly.
    const [result] = await pool.execute(
      `UPDATE tbl_psu_yearwise_mstr SET status = 1, Submitted_At = NOW() WHERE id = ?`,
      [psu_mstr_id]
    );
    if (result && result.affectedRows && result.affectedRows > 0) {
      return res.json({ success: true, message: 'Form sent for approval.' });
    }
    // If no rows updated, still respond OK so frontend can show a confirmation.
    return res.status(200).json({ success: true, message: 'Request recorded. Admin will review.' });
  } catch (err) {
    console.error('Error sending for approval:', err);
    // If the column does not exist or update fails, return a friendly message.
    return res.status(500).json({ success: false, message: 'Failed to send for approval. Contact admin.' });
  }
};

// --- Balance Sheet (Step 2) ---
// Fetch Balance Sheet data for a given psu_mstr_id
exports.getBalanceSheet= async (req, res) => {
  const psu_mstr_id = req.query.psu_mstr_id;
  let balanceSheetData = null;
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM tbl_balancesheet_indicator WHERE psu_mstr_id = ? LIMIT 1`,
      [psu_mstr_id]
    );
    if (rows && rows.length > 0) {
      balanceSheetData = rows[0];
    }
  } catch (err) {
    console.error('Error fetching balance sheet:', err);
  }
  // console.log({balanceSheetData: {"Total Asset": balanceSheetData.tot_asset, "Total Current Asset": balanceSheetData.tot_curr_asset, "Total Liabilities": balanceSheetData.tot_liabilities, "Total Current Liabilities": balanceSheetData.tot_curr_liabilities, "Total Longterm Debt": balanceSheetData.tot_longterm_debt, "Total Equity": balanceSheetData.tot_equity, "Inventory": balanceSheetData.inventory, "Accounts Receivable": balanceSheetData.acc_receivable, "Accounts Payable": balanceSheetData.acc_payble}});
  res.json({balanceSheetData: {"Total Asset": balanceSheetData.tot_asset, "Total Current Asset": balanceSheetData.tot_curr_asset, "Total Liabilities": balanceSheetData.tot_liabilities, "Total Current Liabilities": balanceSheetData.tot_curr_liabilities, "Total Longterm Debt": balanceSheetData.tot_longterm_debt, "Total Equity": balanceSheetData.tot_equity, "Inventory": balanceSheetData.inventory, "Accounts Receivable": balanceSheetData.acc_receivable, "Accounts Payable": balanceSheetData.acc_payble}});
};

// --- Income Sheet (Step 2) ---

// --- Govt Relation Sheet (Step 2) ---

// Insert Balance Sheet data
exports.submitBalanceSheet = async (req, res) => {
  console.log('Received Balance Sheet data:', req.body);
  const {
    tot_asset,
    tot_curr_asset,
    tot_liabilities,
    tot_curr_liabilities,
    tot_longterm_debt,
    tot_equity,
    inventory,
    acc_receivable,
    acc_payble,
    psu_mstr_id
  } = req.body;

  // Validate psu_mstr_id
  if (!psu_mstr_id) {
    return res.status(400).json({ errors: [{ msg: 'Please save Year Wise Data first (Step 1).' }] });
  }

  try {
    // Check if record already exists for this psu_mstr_id
    const [existing] = await pool.execute(
      'SELECT id FROM tbl_balancesheet_indicator WHERE psu_mstr_id = ?',
      [psu_mstr_id]
    );

    if (existing && existing.length > 0) {
      // Update existing record
      const updateQuery = `UPDATE tbl_balancesheet_indicator SET
        tot_asset=?, tot_curr_asset=?, tot_liabilities=?, tot_curr_liabilities=?,
        tot_longterm_debt=?, tot_equity=?, inventory=?, acc_receivable=?, acc_payble=?, updated_at=NOW()
        WHERE psu_mstr_id=?`;
      const updateValues = [
        tot_asset, tot_curr_asset, tot_liabilities, tot_curr_liabilities,
        tot_longterm_debt, tot_equity, inventory, acc_receivable, acc_payble, psu_mstr_id
      ];
      await pool.execute(updateQuery, updateValues);
      return res.json({ success: true, message: 'Balance Sheet updated successfully!' });
    }

    // Insert new record
    const insertQuery = `INSERT INTO tbl_balancesheet_indicator
      (tot_asset, tot_curr_asset, tot_liabilities, tot_curr_liabilities, tot_longterm_debt, tot_equity, inventory, acc_receivable, acc_payble, psu_mstr_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const insertValues = [
      tot_asset, tot_curr_asset, tot_liabilities, tot_curr_liabilities,
      tot_longterm_debt, tot_equity, inventory, acc_receivable, acc_payble, psu_mstr_id
    ];
    const [result] = await pool.execute(insertQuery, insertValues);
    return res.json({ success: true, message: 'Balance Sheet saved successfully!', id: result.insertId });
  } catch (err) {
    console.error('DB Insert Error (Balance Sheet):', err);
    return res.status(500).json({ errors: [{ msg: 'Database error: ' + err.message }] });
  }
};

// Update Balance Sheet data
exports.updateBalanceSheet = async (req, res) => {
  const {
    balanceSheetId,
    tot_asset,
    tot_curr_asset,
    tot_liabilities,
    tot_curr_liabilities,
    tot_longterm_debt,
    tot_equity,
    inventory,
    acc_receivable,
    acc_payble,
    psu_mstr_id
  } = req.body;
  try {
    const updateQuery = `UPDATE tbl_balancesheet_indicator SET 
      tot_asset=?, tot_curr_asset=?, tot_liabilities=?, tot_curr_liabilities=?, tot_longterm_debt=?, tot_equity=?, inventory=?, acc_receivable=?, acc_payble=?, psu_mstr_id=?, updated_at=NOW()
      WHERE id=?`;
    const updateValues = [
      tot_asset,
      tot_curr_asset,
      tot_liabilities,
      tot_curr_liabilities,
      tot_longterm_debt,
      tot_equity,
      inventory,
      acc_receivable,
      acc_payble,
      psu_mstr_id,
      balanceSheetId
    ];
   
    await pool.execute(updateQuery, updateValues);
    return res.json({ success: true, message: 'Balance Sheet updated successfully!' });
  } catch (err) {
    console.error('DB Update Error (Balance Sheet):', err);
    return res.status(500).json({ errors: [{ msg: 'Database error. Please try again.' }] });
  }
};
// Update Year Wise Data
exports.updateYearWiseData = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(400).json({ errors: errors.array() });
    }
    return res.status(400).render('psu/dashboard', {
      layout: 'layouts/dashboard',
      title: 'PSU Dashboard',
      formErrors: errors.array(),
      formData: req.body
    });
  }

  // Validate multiple challan receipt files if present
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      if (file.mimetype !== 'application/pdf') {
        return res.status(400).json({ success: false, message: 'Only PDF files are allowed for Challan Receipt.' });
      }
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({ success: false, message: 'Challan Receipt file size should not exceed 5MB.' });
      }
    }
  }

  const DmdNo = req.session.user.dmdNo;
  const Psu_Name = req.session.user.Psu_Name;
  
  const {
    txtAuthorizedShareCap,
    txtSubShareCap,
    txtPaidUpShareCap,
    txtGovtContribution,
    txtGovtContributionPercent,
    txtNameofShareHolders,
    profitLossType,
    txtProfitLossAmount,
    txtPAT,
    txtDividendPayable,
    txtDividendpaid,
    txtFinYr,
    yearWiseId
  } = req.body;

  // Determine Profit/Loss value based on radio selection
  const txtProfitLoss = profitLossType === 'profit' ? txtProfitLossAmount : `-${txtProfitLossAmount}`;
  try {
    // Handle multiple file uploads if present
    let newFilePaths = [];
    if (req.files && req.files.length > 0) {
      const fs = require('fs');
      const path = require('path');
      const uploadDir = path.join(__dirname, '../../public/uploads/challan-receipts');

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Get old file path to append to
      const [oldData] = await pool.execute(
        `SELECT chaln_recipt FROM tbl_psu_yearwise_mstr WHERE id = ?`,
        [yearWiseId]
      );

      // Save each new file
      req.files.forEach(file => {
        const fileName = `${Date.now()}_${file.originalname}`;
        const filePath = `public/uploads/challan-receipts/${fileName}`;
        fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);
        newFilePaths.push(filePath);
      });

      // Append to existing files if any
      if (oldData && oldData.length > 0 && oldData[0].chaln_recipt) {
        const existingFiles = oldData[0].chaln_recipt.split(',').map(f => f.trim()).filter(f => f);
        newFilePaths = existingFiles.concat(newFilePaths);
      }
    }
    const challanReceiptPath = newFilePaths.length > 0 ? newFilePaths.join(',') : null;

    let updateQuery = `UPDATE tbl_psu_yearwise_mstr SET 
      Auth_Share_Capital=?, Sub_Share_Capital=?, Paid_Share_Capital=?, Govt_Contri_Amt=?, Govt_Contri_Percent=?, NameOf_Share_Holder=?, profitLossType = ?, Profit_Loss=?, PAT=?, Dividend_Payable=?, Dividend_Paid=?, FinYr=?`;
    
    let updateValues = [
      txtAuthorizedShareCap,
      txtSubShareCap,
      txtPaidUpShareCap,
      txtGovtContribution,
      txtGovtContributionPercent || null,
      txtNameofShareHolders,
      profitLossType,
      txtProfitLossAmount,
      txtPAT,
      txtDividendPayable,
      txtDividendpaid,
      txtFinYr || null
    ];

    // Add file update if present
    if (challanReceiptPath) {
      updateQuery += `, chaln_recipt=?`;
      updateValues.push(challanReceiptPath);
    }

    updateQuery += `, Modifed_Dt=NOW() WHERE id=? AND DmdNo=? AND Psu_Name=?`;
    updateValues.push(yearWiseId, DmdNo, Psu_Name);

    const [result] = await pool.execute(updateQuery, updateValues);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ success: true, message: 'Form updated successfully!' });
    }
  } catch (err) {
    console.error('DB Update Error:', err);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ errors: [{ msg: 'Database error. Please try again.' }] });
    }
    res.status(500).render('psu/dashboard', {
      layout: 'layouts/dashboard',
      title: 'PSU Dashboard',
      formErrors: [{ msg: 'Database error. Please try again.' }],
      formData: req.body
    });
  }
};
// Fetch year-wise data for a given year and PSU
exports.getYearWiseForm = async (req, res) => {
  //console.log('Request body for year-wise form:', req.body);
  const Fin_Yr = req.body.finYr;
  const Psu_Name = req.session.user.Psu_Name;
  const DmdNo = req.session.user.dmdNo;
  const userId = req.session.user.id;
  let yearWiseData = null;
  let balanceSheetData = null;
  let incomeSheetData = null;
  let govtRelData = null;
  let annualReportData;
  try {
    // Year Wise
    const [rows] = await pool.execute(
      `SELECT * FROM tbl_psu_yearwise_mstr WHERE user_id = ? AND DmdNo = ? AND Psu_Name = ? AND FinYr = ? LIMIT 1`,
      [userId, DmdNo, Psu_Name, Fin_Yr]
    );
    if (rows && rows.length > 0) {
      yearWiseData = rows[0];
    }
    // Balance Sheet
    if (yearWiseData && yearWiseData.id) {
      const [bsRows] = await pool.execute(
        `SELECT * FROM tbl_balancesheet_indicator WHERE psu_mstr_id = ? LIMIT 1`,
        [yearWiseData.id]
      );
      if (bsRows && bsRows.length > 0) balanceSheetData = bsRows[0];
      // Income Statement
      const [incRows] = await pool.execute(
        `SELECT * FROM tbl_income_sheet_indicator WHERE psu_mstr_id = ? LIMIT 1`,
        [yearWiseData.id]
      );
      if (incRows && incRows.length > 0) incomeSheetData = incRows[0];
      // Govt Rel
      const [govtRows] = await pool.execute(
        `SELECT * FROM tbl_govt_relation WHERE psu_mstr_id = ? LIMIT 1`,
        [yearWiseData.id]
      );
      if (govtRows && govtRows.length > 0) govtRelData = govtRows[0];
      // Annual Report
      const [annRows] = await pool.execute(
        `SELECT * FROM tbl_anual_report WHERE psu_mstr_id = ? LIMIT 1`,
        [yearWiseData.id]
      );
      if (annRows && annRows.length > 0) annualReportData = annRows[0];
    }
  } catch (err) {
    console.error('Error fetching year-wise data:', err);
  }
  res.render('psu/yearWiseForm', {
    layout: 'layouts/dashboard',
    title: 'Year Wise Data Form',
    Psu_Name,
    Fin_Yr,
    role: req.session?.user?.role, // 688
    yearWiseData,
    balanceSheetData,
    incomeSheetData,
    govtRelData,
    annualReportData
  });
};

const { validationResult } = require('express-validator');

exports.dashboard = async (req, res) => {
  console.log('Session data:', req.session.user);
  const Years = ['2020-21', '2021-22', '2022-23', '2023-24', '2024-25', '2025-26'];
  const userId = req.session.user.id;
  const role = req.session.user.role;
  
  const [result] = await pool.execute(
    `SELECT FinYr, status 
    FROM tbl_psu_yearwise_mstr 
    WHERE user_id = ?`,
    [userId]
  );
  console.log('Year-wise status fetched for dashboard:', result);
  // Convert to object for fast lookup
  let yearStatusMap = {};
  result.forEach(row => {
      yearStatusMap[row.FinYr] = row.status;
  });
  res.render('psu/dashboard', {
    layout: 'layouts/dashboard', // use the dashboard layout
    title: 'PSU Dashboard',
    Psu_Name: req.session.user.Psu_Name,
    role: req.session.user.role,
    Years,
    yearStatusMap 
  });
};


const pool = require('../config/db');

// Handle Year Wise Data form submission
exports.submitYearWiseData = async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(400).json({ errors: errors.array() });
    }
    return res.status(400).render('psu/dashboard', {
      layout: 'layouts/dashboard',
      title: 'PSU Dashboard',
      formErrors: errors.array(),
      formData: req.body
    });
  }

  // Validate multiple challan receipt files if present
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      if (file.mimetype !== 'application/pdf') {
        return res.status(400).json({ success: false, message: 'Only PDF files are allowed for Challan Receipt.' });
      }
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({ success: false, message: 'Challan Receipt file size should not exceed 5MB.' });
      }
    }
  }

console.log('Session data:', req.session.user);
  // Get DmdNo and Psu_Name from session
  const DmdNo = req.session.user.dmdNo;
  const Psu_Name = req.session.user.Psu_Name;
  const userId = req.session.user.id; 
  //console.log('DmdNo:', DmdNo, 'Psu_Name:', Psu_Name);
  if (!DmdNo || !Psu_Name) {
    return res.status(400).json({ errors: [{ msg: 'Session expired. Please login again.' }] });
  }
 

  // Get form data
  const {
    txtAuthorizedShareCap,
    txtSubShareCap,
    txtPaidUpShareCap,
    txtGovtContribution,
    txtGovtContributionPercent,
    txtNameofShareHolders,
    profitLossType,
    txtProfitLossAmount,
    txtPAT,
    txtDividendPayable,
    txtDividendpaid,
    txtFinYr,
    txtGovtContriPercent
  } = req.body;

   // Determine Profit/Loss value based on radio selection
  const txtProfitLoss = profitLossType === 'profit' ? txtProfitLossAmount : `${txtProfitLossAmount} * -1`;
  try {
    // Handle multiple file uploads if present
    let challanReceiptPaths = [];
    if (req.files && req.files.length > 0) {
      const fs = require('fs');
      const path = require('path');
      const uploadDir = path.join(__dirname, '../../public/uploads/challan-receipts');

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save each file
      req.files.forEach(file => {
        const fileName = `${Date.now()}_${file.originalname}`;
        const filePath = `public/uploads/challan-receipts/${fileName}`;
        fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);
        challanReceiptPaths.push(filePath);
      });
    }
    const challanReceiptPath = challanReceiptPaths.length > 0 ? challanReceiptPaths.join(',') : null;

    const insertQuery = `INSERT INTO tbl_psu_yearwise_mstr 
      ( user_id, DmdNo, Psu_Name, Auth_Share_Capital, Sub_Share_Capital, Paid_Share_Capital, Govt_Contri_Amt, Govt_Contri_Percent, NameOf_Share_Holder,profit_loss_type, Profit_Loss, PAT, Dividend_Payable, Dividend_Paid, FinYr, chaln_recipt, Created_Dt, Modifed_Dt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, NOW(), NOW())`;
    const insertValues = [
      userId,
      DmdNo,
      Psu_Name,
      txtAuthorizedShareCap,
      txtSubShareCap,
      txtPaidUpShareCap,
      txtGovtContribution,
      txtGovtContributionPercent || null,
      txtNameofShareHolders,
      profitLossType,
      txtProfitLoss,
      txtPAT,
      txtDividendPayable,
      txtDividendpaid,
      txtFinYr || null,
      challanReceiptPath
    ];
    console.log('Insert Query:', insertQuery);
    console.log('Insert Values:', insertValues);
    const [result] = await pool.execute(insertQuery, insertValues);
    // Store the inserted row's id in session for next form use
    console.log('Insert Result:', result);
    if (result && result.insertId) {
      req.session.psuYearwiseId = result.insertId;
      return res.json({ success: true, message: 'Form submitted and saved successfully!!!', id: result.insertId });
    }
    // if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    //   return res.json({ success: true, message: 'Form submitted and saved successfully!!!', id: result.insertId });
    // }
    // res.render('psu/dashboard', {
    //   layout: 'layouts/dashboard',
    //   title: 'PSU Dashboard',
    //   success: 'Form submitted and saved successfully!'
    // });
  } catch (err) {
    console.error('DB Insert Error:', err);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ errors: [{ msg: 'Database error. Please try again.' }] });
    }
    res.status(500).render('psu/dashboard', {
      layout: 'layouts/dashboard',
      title: 'PSU Dashboard',
      formErrors: [{ msg: 'Database error. Please try again.' }],
      formData: req.body
    });
  }
};

// View all PSU data for the logged-in user
exports.viewPsuData = async (req, res) => {
  
  res.render('psu/viewData', { 
      layout: 'layouts/dashboard',
      title: 'View PSU Data', 
      DmdNo: req.session.user.dmdNo,
      Psu_Name: req.session.user.Psu_Name
    });
};

// View year-wise PSU data for the logged-in user
exports.viewPsuDataYearwise = async (req, res) => { 
    let DemantData = null;
    const [rows] = await pool.execute(
      `SELECT * FROM tbl_department order BY DmdNo ASC`
    );
    if (rows && rows.length > 0) {
      DemantData = rows;
    }
  res.render('psu/viewDataYearwise', { 
      layout: 'layouts/dashboard',
      title: 'View PSU Year-wise Data',
      role: req.session.user.role,
      demands: DemantData
    })
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

exports.downloadReportPdf = async (req, res) => {
  // Implement logic to generate and send PDF report
  res.send('PDF report download functionality to be implemented.');
};

exports.downloadReportPdf = async (req, res) => {
  // Implement logic to generate and send PDF report
  const { finYr, dmdNo, psuId } = req.query;
  const pool = require('../config/db');
  const PDFDocument = require('pdfkit-table');

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

  const doc = new PDFDocument({ margin: 20, size: 'A4' });

  res.setHeader('Content-Disposition', 'attachment; filename=psu_report.pdf');
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);

  doc.fontSize(14).text('PSU Financial Report', { align: 'center' });
  doc.moveDown(1);

  const table = {
    headers: [
      { label: 'Sl No', property: 'sl', width: 20 },
      { label: 'PSU Name', property: 'Psu_Name', width: 90 },
      { label: 'Auth Capital', property: 'Auth_Share_Capital', width: 60 },
      { label: 'Paid Capital', property: 'Paid_Share_Capital', width: 60 },
      { label: 'Govt Contri', property: 'Govt_Contri_Amt', width: 60 },
      { label: 'PAT', property: 'PAT', width: 60 },
      { label: 'Dividend Payable', property: 'Dividend_Payable', width: 60 },
      { label: 'Dividend Paid', property: 'Dividend_Paid', width: 60 },
      { label: 'Financial Year', property: 'FinYr', width: 60 }
    ],
    datas: rows.map((r, i) => ({
      sl: i + 1,
      ...r
    }))
  };

  await doc.table(table, {
    prepareHeader: () => doc.fontSize(8).font('Helvetica-Bold'),
    prepareRow: () => doc.fontSize(8).font('Helvetica')
  });

  doc.end();
}