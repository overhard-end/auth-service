const User = require('../models/user');
const Session = require('../models/session');

const Token = require('../utils/token');
const Hash = require('../utils/hash');
const UserDTO = require('../DTOs/userDTO');
class AuthService {
  async getUser(email) {
    const user = await User.findOne({ email: email });
    if (user === null) return false;
    return user;
  }

  async register(email, password, userAgent) {
    try {
      const hashPassword = await Hash.createPasswordHash(password);
      const newUser = await User.create({ email: email, password: hashPassword });
      const tokens = Token.tokenPair(newUser.email);

      const session = {
        refreshToken: tokens.refreshToken,
        userId: newUser.id,
        expiresIn: process.env.TOKEN_EXPIRES_TIME,
        fingerprint: userAgent,
      };
      await Session.create(session);

      return { user: newUser, ...tokens };
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async login(user, userAgent) {
    try {
      const tokens = Token.tokenPair(user.email);

      const session = {
        refreshToken: tokens.refreshToken,
        userId: user._id,
        expiresIn: process.env.TOKEN_EXPIRES_TIME,
        fingerprint: userAgent,
      };
      await Session.create(session);
      return tokens;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
module.exports = new AuthService();
