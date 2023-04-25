const bcrypt = require('bcrypt');
const saltRounds = 10;

class Hash {
  async comparePassword(hash, password) {
    const result = await bcrypt.compare(password, hash);
    return result;
  }
  async createPasswordHash(password) {
    const hashedPassword = new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) reject(undefined);
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) reject(undefined);
          if (hash) resolve(hash);
        });
      });
    });
    return hashedPassword;
  }
}

module.exports = new Hash();
