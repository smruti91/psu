const { body, validationResult } = require('express-validator');

// Validation middleware for Year Wise Data form
const validateYearWiseData = [
  body('txtNameofPSU').notEmpty().withMessage('Name of the PSU is required.'),
  body('txtAuthorizedShareCap').notEmpty().withMessage('Authorized Share Capital is required.').isNumeric().withMessage('Authorized Share Capital must be a number.'),
  body('txtSubShareCap').notEmpty().withMessage('Subscribed Share Capital is required.').isNumeric().withMessage('Subscribed Share Capital must be a number.'),
  body('txtPaidUpShareCap').notEmpty().withMessage('Paid-up Share Capital is required.').isNumeric().withMessage('Paid-up Share Capital must be a number.'),
  body('txtGovtContribution').notEmpty().withMessage('Govt. Contribution is required.').isNumeric().withMessage('Govt. Contribution must be a number.'),
  body('txtNameofShareHolders').notEmpty().withMessage('Name of the Share Holders is required.'),
 
];

module.exports = {
  validateYearWiseData
};
