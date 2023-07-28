const bcrypt = require('bcrypt');
const saltRounds = 10;

class Hash {
  async comparePassword(hash, password) {
    return await bcrypt.compare(password, hash);
  }
  async createPasswordHash(password) {
    return bcrypt.hashSync(password, saltRounds);
   
  }
}

module.exports = new Hash();
