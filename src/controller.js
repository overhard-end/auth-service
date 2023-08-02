const authService = require('./services/auth-service');
const emailService = require('./services/email-service');
const UserDTO = require('./userDTO');

const getUserCredentials = (req) => {
  return {
    email: req.body.email,
    password: req.body.password,
    fingerprint: req.fingerprint.hash,
  };
};
const CookieOptions = {
  maxAge: process.env.TOKEN_EXPIRES_TIME,
  httpOnly: true,
};
class Controller {
  async registration(req, res) {
    try {
      const userData = getUserCredentials(req);
      const result = await authService.register(userData);
      if (!result.success) return res.status(403).json({ msg: result.msg, param: result.param });
      const isSended = await emailService.createAndSendToken(result.user._id,result.user.email)
      if(!isSended) return res.status(500).json('Something went wrong');
      res.status(201).json({ success: true, user: result.user.email,msg:'Check your email box to confirm your profile' });
    } catch (error) {
      console.log(error);
      return res.status(500).json('Something went wrong');
    }
  }
  async verifyEmail(req,res){
    try {
    const token = req.query.token
    if(!token) return res.status(400)
    console.log('controler',token)
    const result = await emailService.verifyEmail(token)
    if(!result) return res.status(400).json({success:false,msg:'Invalid link, try again'})
    const pathName = '/auth'
    res.writeHead(301,{Location:process.env.CLIENT_URL + pathName} )
    res.end()
    } catch (error) {
      console.log(error);
      return res.status(500).json('Something went wrong');
    }
    
  }
  async login(req, res) {
    try {
      const userData = getUserCredentials(req);
      const result = await authService.login(userData);
      if (!result.success) return res.status(403).json({ msg: result.msg, param: result.param });
      const userDTO = new UserDTO(result.user);
      res
        .status(200)
        .cookie('refreshToken', result.tokens.refreshToken, CookieOptions)
        .json({ user: userDTO, accessToken: result.tokens.accessToken });
    } catch (error) {
      console.log(error);
      return res.status(500).json('Something went wrong');
    }
  }
  async refreshToken(req, res) {
    try {
      const token = req.cookies.refreshToken;
      const { fingerprint } = getUserCredentials(req);
      if (!token) return res.status(400).json({ msg: 'Missing refreshToken', param: 'token' });
      const result = await authService.updateSession(token, fingerprint);
      if (!result.success) return res.status(400).json({ msg: result.msg, param: result.param });
      res
        .status(201)
        .cookie('refreshToken', result.tokens.refreshToken, CookieOptions)
        .json({ accessToken: result.tokens.accessToken });
    } catch (error) {
      console.error(error);
      res.status(500).json('Something went wrong');
    }
  }
  async logout(req, res) {
    try {
      const token = req.cookies.refreshToken;
      const result = await authService.deleteSession(token);
      if (!result.success) return res.status(400).json({ msg: result.msg, param: result.param });
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json('Something went wrong');
    }
  }
}
module.exports = new Controller();
