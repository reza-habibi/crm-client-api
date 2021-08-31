const mongoose = require("mongoose");

const ResetPinSchema = new mongoose.Schema({
  pin: {
    type: String,
    maxlength: 7,
    minlength: 7,
  },
  email: {
    type: String,
    maxlength: 50,
    required: true,
  },
});

const ResetPass = mongoose.model("ResetPass", ResetPinSchema);
module.exports = ResetPass;
