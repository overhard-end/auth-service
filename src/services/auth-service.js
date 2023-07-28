const Session = require('../models/session');
const Token = require('../utils/token');
const Hash = require('../utils/hash');
const User = require('../models/user');



async function createSession(data) {
  const tokens = Token.generateTokens(data.email);
  const session = {
    refreshToken: tokens.refreshToken,
    userId: data._id,
    expiresIn: process.env.TOKEN_EXPIRES_TIME,
    fingerprint: data.fingerprint,
  };
  await Session.create(session);
  return tokens;
}
class AuthService {
  async register(data) {
    const user = await User.findOne({ email: data.email, });
    if (user) return { success: false, param: 'email', msg: 'User already registered' };
    const hashPassword = await Hash.createPasswordHash(data.password);
    if(!hashPassword) return { success: false, param: 'password', msg: 'Something went wrong' };

    const newUser = await User.create({ email: data.email, password: hashPassword });
    
    return { success: true, user: newUser };
  }

  async login(data) {
    const user = await User.findOne({ email: data.email });
    if (!user) return { success: false, param: 'email', msg: 'User not found' };
    if (!(await Hash.comparePassword(user.password, data.password)))
      return { success: false, param: 'password', msg: 'Incorrect password' };
    const tokens = await createSession({
      email: user.email,
      _id: user._id,
      fingerprint: data.fingerprint,
    });
    return { success: true, user: user, tokens: tokens };
  }

  async updateSession(token, fingerprint) {
    const session = await Session.findOne({ refreshToken: token }).lean();
    if (!session) return { success: false, msg: 'Session not found', param: 'session' };
    const check = Token.verifyToken(token, 'refresh');
    if (!check) return { success: false, msg: 'Incorrect or expared token', param: 'token' };
    if (fingerprint !== session.fingerprint) {
      await Session.deleteOne({ refreshToken: token });
      return { success: false, msg: 'Different fingerprint', param: 'browser' };
    }
    await Session.deleteOne({ refreshToken: token });
    const tokens = await createSession({ ...session, email: check.email });
    return { success: true, tokens: tokens };
  }
  async deleteSession(token) {
    const session = await Session.findOne({ refreshToken: token }).lean();
    if (!session) return { success: false, msg: 'Session not found', param: 'session' };
    await Session.deleteOne({ refreshToken: token });
    return { success: true, msg: 'Session deleted', param: 'session' };
  }
}
module.exports = new AuthService();
