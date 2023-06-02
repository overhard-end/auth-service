const mongoose = require('mongoose');

const Session = new mongoose.Schema(
  {
    refreshToken: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    expiresIn: { type: Number, required: true },
    fingerprint: { type: String, required: true },
    createdAt: { type: Date },
  },
  { versionKey: false, strict: true, strictQuery: false },
);
module.exports = mongoose.model('session', Session);
