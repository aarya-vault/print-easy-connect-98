
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: errors.array()[0].msg,
      details: errors.array()
    });
  }
  next();
};

// FIXED: Phone login validation - accept 10 digits without country code
const validatePhoneLogin = [
  body('phone')
    .isNumeric()
    .withMessage('Phone number must contain only digits')
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
    .isNumeric()
    .isLength({ min: 10, max: 10 })
    .withMessage('Please provide a valid 10-digit phone number'),
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

// Shop creation validation
const validateShopCreation = [
  body('name')
    .isLength({ min: 2, max: 255 })
    .withMessage('Shop name must be between 2 and 255 characters'),
  body('address')
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),
  body('phone')
    .isLength({ min: 10 })
    .withMessage('Phone number is required'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('ownerName')
    .isLength({ min: 2, max: 255 })
    .withMessage('Owner name must be between 2 and 255 characters'),
  body('ownerEmail')
    .isEmail()
    .withMessage('Valid owner email is required'),
  body('ownerPassword')
    .isLength({ min: 6 })
    .withMessage('Owner password must be at least 6 characters long'),
  validateRequest
];

module.exports = {
  validatePhoneLogin,
  validateEmailLogin,
  validateOrderCreation,
  validateProfileUpdate,
  validateShopCreation,
  validateRequest
};
