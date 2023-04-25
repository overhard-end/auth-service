module.exports = class UserDTO {
  constructor(userData) {
    this.email = userData.email;
    this.id = userData._id;
    this.role = userData.role;
  }
};
