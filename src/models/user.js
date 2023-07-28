const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  { 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    verified:{type:Boolean, default:false,required: true,}
  },
  { versionKey: false, strict: true, strictQuery: false },
);

module.exports = mongoose.model('user', userSchema);
