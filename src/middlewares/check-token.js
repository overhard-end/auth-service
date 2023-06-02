const Token = require('../utils/token');

function checkToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!authHeader) return res.status(401).json('Not authorized');
    const result = Token.verifyToken(token, 'access');
    if (!result) return res.status(401).json('Incorrect or expared tokend');
    req.body.email = result.email;
    next();
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}
module.exports = checkToken;
