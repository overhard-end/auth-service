const jwt = require('jsonwebtoken');
const accessKey = process.env.JWT_ACCESS_TOKEN_KEY;
const refreshKey = process.env.JWT_RESRESH_TOKEN_KEY;
const emailVerifyKey = process.env.JWT_EMAIL_VERIFY_TOKEN_KEY
class Token {
  verifyToken(token, type) {
    const key = type === 'refresh' ? refreshKey : accessKey;
    return jwt.verify(token, key, (err, decoded) => (!err ? decoded : false));
  }
  verifyEmailToken(token){
    return jwt.verify(token,emailVerifyKey,(err,decoded)=>!err?decoded:false)
  }
  createEmailVerifyToken(userId){
    return jwt.sign({userId:userId},emailVerifyKey,{expiresIn:'60m'})
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
