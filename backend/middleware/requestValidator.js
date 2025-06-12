
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

// FIXED: Phone login validation - accept exactly 10 digits
const validatePhoneLogin = [
  body('phone')
    .isString()
    .withMessage('Phone number must be a string')
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be exactly 10 digits')
    .matches(/^\d{10}$/)
    .withMessage('Phone number must contain only 10 digits'),
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

// FIXED: Order creation validation - Use correct enum values
const validateOrderCreation = [
  body('shopId')
    .isUUID()
    .withMessage('Valid shop ID is required'),
  body('orderType')
    .isIn(['digital', 'walkin'])
    .withMessage('Order type must be either digital or walkin'),
  body('customerName')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Customer name must be between 2 and 255 characters'),
  body('customerPhone')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  validateRequest
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  validateRequest
];

// FIXED: Shop creation validation - Complete validation
const validateShopCreation = [
  body('shopName')
    .isLength({ min: 2, max: 255 })
    .withMessage('Shop name must be between 2 and 255 characters'),
  body('address')
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),
  body('contactNumber')
    .matches(/^\d{10}$/)
    .withMessage('Contact number must be exactly 10 digits'),
  body('ownerName')
    .isLength({ min: 2, max: 255 })
    .withMessage('Owner name must be between 2 and 255 characters'),
  body('ownerEmail')
    .isEmail()
    .withMessage('Valid owner email is required'),
  body('ownerPassword')
    .isLength({ min: 6 })
    .withMessage('Owner password must be at least 6 characters long'),
  body('allowOfflineAccess')
    .isBoolean()
    .withMessage('Allow offline access must be a boolean'),
  body('shopTimings')
    .isLength({ min: 5, max: 100 })
    .withMessage('Shop timings must be between 5 and 100 characters'),
  validateRequest
];

// ADDED: Shop update validation
const validateShopUpdate = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Shop name must be between 2 and 255 characters'),
  body('address')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),
  body('phone')
    .optional()
    .matches(/^\d{10}$/)
    .withMessage('Contact number must be exactly 10 digits'),
  body('shop_timings')
    .optional()
    .isLength({ min: 5, max: 100 })
    .withMessage('Shop timings must be between 5 and 100 characters'),
  validateRequest
];

// ADDED: User update validation
const validateUserUpdate = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Name must be between 2 and 255 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be a boolean'),
  validateRequest
];

module.exports = {
  validatePhoneLogin,
  validateEmailLogin,
  validateOrderCreation,
  validateProfileUpdate,
  validateShopCreation,
  validateShopUpdate,
  validateUserUpdate,
  validateRequest
};
