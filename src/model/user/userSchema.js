const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  address: { type: String, maxlength: 150 },
  phone: { type: Number, required: true, minlength: 11, maxlength: 13 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, maxlength: 100 },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
