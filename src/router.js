const express = require('express');
const router = express.Router();

const Controller = require('./controller');
const checkToken = require('./middlewares/check-token');
const { authValidator } = require('./middlewares/auth-validator');
const userService = require('./services/user-service');

router.post('/register', authValidator, Controller.registration);
router.post('/login', authValidator, Controller.login);
router.get('/token', Controller.refreshToken);
router.get('/logout', checkToken, Controller.logout);
router.get('/user', checkToken, userService.getUser);
router.get('/verify', Controller.verifyEmail);


module.exports = router;
