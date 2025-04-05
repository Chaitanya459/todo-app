const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, match: /.+@.+\..+/ },
  password: { type: String, required: true }  // this will store the hashed password
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
