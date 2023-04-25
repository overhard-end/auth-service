const Token = require('../utils/token');
const refreshKey = process.env.JWT_RESRESH_TOKEN_KEY;
const Session = require('../models/session');

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  const userAgent = await req.get('user-agent');
  try {
    if (!token) return res.sendStatus(400);
    // Check refresh token in session
    const session = await Session.findOne({ refreshToken: token }).lean();
    if (session == null) return res.sendStatus(400);

    //Check refresh token for validity
    const check = Token.checkToken(token, refreshKey);
    if (!check?.valid) return res.status(400).json({ message: check.message });

    // Compare the session fingerprint with request fingerprint
    if (userAgent !== session.fingerprint)
      return res.status(400).json({ message: 'INVALID_REFRESH_SESSION' });

    // If all good, delete the current session and create a new one

    const newTokens = Token.tokenPair(check?.decoded.email);
    const jsonSession = Object.assign({}, session);
    const newSession = {
      ...jsonSession,
      refreshToken: newTokens.refreshToken,
    };
    console.log(newSession);
    await Session.deleteOne({ refreshToken: token });
    await Session.create(newSession);
    const CookieOptions = {
      maxAge: process.env.TOKEN_EXPIRES_TIME,
      httpOnly: true,
    };
    res
      .status(201)
      .cookie('refreshToken', newTokens.refreshToken, CookieOptions)
      .json({ accessToken: newTokens.accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};
module.exports = refreshToken;
