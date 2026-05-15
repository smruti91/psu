const { body, validationResult } = require('express-validator');

// Validation middleware for Year Wise Data form
const validateYearWiseData = [
  body('txtNameofPSU').notEmpty().withMessage('Name of the PSU is required.'),
  body('txtAuthorizedShareCap').notEmpty().withMessage('Authorized Share Capital is required.').isNumeric().withMessage('Authorized Share Capital must be a number.'),
  body('txtSubShareCap').notEmpty().withMessage('Subscribed Share Capital is required.').isNumeric().withMessage('Subscribed Share Capital must be a number.'),
  body('txtPaidUpShareCap').notEmpty().withMessage('Paid-up Share Capital is required.').isNumeric().withMessage('Paid-up Share Capital must be a number.'),
  body('txtGovtContribution').notEmpty().withMessage('Govt. Contribution is required.').isNumeric().withMessage('Govt. Contribution must be a number.'),
  body('txtNameofShareHolders').notEmpty().withMessage('Name of the Share Holders is required.'),
  body('txtProfitLossAmount').notEmpty().withMessage('Profit & Loss is required.').isNumeric().withMessage('Profit & Loss must be a number.'),
  body('txtPAT').notEmpty().withMessage('Profit After Tax (PAT) is required.').isNumeric().withMessage('Profit After Tax (PAT) must be a number.'),
  body('txtDividendPayable').notEmpty().withMessage('Dividend Payable is required.').isNumeric().withMessage('Dividend Payable must be a number.'),
  body('txtDividendpaid').notEmpty().withMessage('Dividend Paid is required.').isNumeric().withMessage('Dividend Paid must be a number.'),
];

module.exports = {
  validateYearWiseData
};
