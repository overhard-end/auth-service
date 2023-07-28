const User = require('../models/user');
const UserDTO = require('../userDTO');

class userService {
  async getUser(req, res) {
    const email = req.body.email;
    console.log(email)
    const user = await User.findOne({ email: email });
    if (user === null) return res.status(404).json({ msg: 'User not found', param: 'email' });
    const userDTO = new UserDTO(user);
    return res.json(userDTO);
  }
}
module.exports = new userService();
