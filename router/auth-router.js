const authController = require('../controllers/auth-controller');
const express = require('express');
const token = require('../utils/token');
const refreshToken = require('../middlewares/refresh-token');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const accessTokenCheck = require('../middlewares/access-token-check');

router.post(
  '/register',
  body('email').isEmail().withMessage('Email must be a valid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({ message: errors.array() });
    }
    next();
  },
  authController.registration,
);
router.post(
  '/login',
  body('email').isEmail().withMessage('Email must be email format'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({ message: errors.array() });
    }
    next();
  },
  authController.login,
);
router.post('/token', refreshToken);
router.get('/user', accessTokenCheck, authController.getUserCredentials);

module.exports = router;
