const UserDTO = require('../DTOs/userDTO');
const authService = require('../services/auth-service');
const Hash = require('../utils/hash');

class AuthController {
  async getUserCredentials(req, res) {
    try {
      const email = req.body.email;
      const user = await authService.getUser(email);
      if (!user) return res.status(400).json('user not found');
      const userDTO = new UserDTO(user);
      return res.status(200).json(userDTO);
    } catch (error) {}
  }
  async registration(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const userAgent = req.get('user-agent');

      const user = await authService.getUser(email);
      if (user)
        return res.status(403).json({
          message: [{ value: email, msg: 'User already exist', param: 'email' }],
        });

      const newUser = await authService.register(email, password, userAgent);
      if (!newUser)
        return res.status(400).json({
          message: [{ value: '', msg: 'registration failed', param: '' }],
        });
      const CookieOptions = {
        maxAge: process.env.TOKEN_EXPIRES_TIME,
        httpOnly: true,
      };
      const userDTO = new UserDTO(newUser.user);
      res
        .status(201)
        .cookie('refreshToken', newUser.refreshToken, CookieOptions)
        .json({ user: userDTO, accessToken: newUser.accessToken });
    } catch (error) {
      console.log(error);
      return res.status(500).json('Something went wrong');
    }
  }

  async login(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const userAgent = req.get('user-agent');

      const user = await authService.getUser(email);
      if (!user) {
        return res.status(403).json({
          message: [{ value: email, msg: 'User dont exist', param: 'email' }],
        });
      }
      const checkPassword = await Hash.comparePassword(user.password, password);
      if (!checkPassword)
        return res.status(403).json({
          message: [{ value: password, msg: 'Wrong password', param: 'password' }],
        });

      const loginResult = await authService.login(user, userAgent);
      if (!loginResult)
        return res.status(403).json({
          message: [{ value: '', msg: 'login failed ', param: '' }],
        });
      const cookieOptions = {
        maxAge: process.env.TOKEN_EXPIRES_TIME,
        httpOnly: true,
      };
      const userDTO = new UserDTO(user);
      res
        .status(200)
        .cookie('refreshToken', loginResult.refreshToken, cookieOptions)
        .json({ user: userDTO, accessToken: loginResult.accessToken });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: [{ value: '', msg: 'something went wrong ', param: '' }],
      });
    }
  }
  async logout(req, res, next) {}
}
module.exports = new AuthController();
