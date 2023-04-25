const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema(
  {
    refreshToken: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    expiresIn: { type: Number, required: true },
    fingerprint: { type: String, required: true },
  },
  { versionKey: false },
);
module.exports = mongoose.model('session', SessionSchema);
