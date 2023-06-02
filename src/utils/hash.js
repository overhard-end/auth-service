const bcrypt = require('bcrypt');
const saltRounds = process.env.PASSWORD_SALT;

class Hash {
  async comparePassword(hash, password) {
    return await bcrypt.compare(password, hash);
  }
  async createPasswordHash(password) {
    return new Promise((resolve, reject) => {
      try {
        bcrypt.genSalt(saltRounds, (err, salt) =>
          bcrypt.hash(password, salt, (err, hash) => resolve(hash)),
        );
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new Hash();
