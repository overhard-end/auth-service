const mongoose = require('mongoose');

const Session = new mongoose.Schema(
  {
    refreshToken: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, expires:process.env.TOKEN_EXPIRES_TIME },
    fingerprint: { type: String, required: true },
  },
  { versionKey: false, strict: true, strictQuery: false,timestamps:true },
  
);
module.exports = mongoose.model('session', Session);
