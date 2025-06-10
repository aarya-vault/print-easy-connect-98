
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Phone login validation
const validatePhoneLogin = [
  body('phone')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian phone number')
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be exactly 10 digits'),
  validateRequest
];

// Email login validation
const validateEmailLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateRequest
];

// Order creation validation
const validateOrderCreation = [
  body('shopId')
    .isInt({ min: 1 })
    .withMessage('Valid shop ID is required'),
  body('orderType')
    .isIn(['uploaded-files', 'walk-in'])
    .withMessage('Order type must be either uploaded-files or walk-in'),
  body('customerName')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Customer name must be between 2 and 255 characters'),
  body('customerPhone')
    .optional()
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid phone number'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  validateRequest
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  validateRequest
];

module.exports = {
  validatePhoneLogin,
  validateEmailLogin,
  validateOrderCreation,
  validateProfileUpdate,
  validateRequest
};
