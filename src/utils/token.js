const jwt = require('jsonwebtoken');
const accessKey = process.env.JWT_ACCESS_TOKEN_KEY;
const refreshKey = process.env.JWT_RESRESH_TOKEN_KEY;
class Token {
  verifyToken(token, type) {
    const key = type === 'refresh' ? refreshKey : accessKey;
    return jwt.verify(token, key, (err, decoded) => (!err ? decoded : false));
  }

  createAccessToken(email) {
    return jwt.sign({ email: email }, accessKey, { expiresIn: '1m' });
  }
  createRefreshToken(email) {
    return jwt.sign({ email: email }, refreshKey);
  }
  generateTokens(email) {
    const accessToken = this.createAccessToken(email);
    const refreshToken = this.createRefreshToken(email);
    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}

module.exports = new Token();
