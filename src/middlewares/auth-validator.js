const { validationResult, body } = require('express-validator');

exports.authValidator = [
  body('email').isEmail().withMessage('Not a valid email'),
  function (req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(403).json(result.array()[0]);
    }
    next();
  },
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  function (req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(403).json(result.array()[0]);
    }
    next();
  },
];
