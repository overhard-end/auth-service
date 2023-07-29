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
      const token =   await emailService.createEmailToken(result.user._id)
      if(!token)return res.status(403).json({message:'something went wrong saving the token for email'})

     const isEmailSended =  await emailService.sendVerifyEmail(result.user.email,token.token,token.userId)
     if(!isEmailSended) return res.status(403).json({message:'something went wrong with seinding email'})
      res.status(201).json({ success: true, user: result.user.email,msg:'check you email where were sended email confirm' });
    } catch (error) {
      console.log(error);
      return res.status(500).json('Something went wrong');
    }
  }
  async verifyEmail(req,res){
    const userId = req.query.id
    const token = req.query.token
    if(!userId||!token) return res.status(400)
    const result =  await emailService.verifyEmail(userId,token)
    
    if(!result)return res.status(400).json({msg:'invalid link, try again'})
    console.log(result)
    res.write("<h1>your email wan confir</h1>")

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
