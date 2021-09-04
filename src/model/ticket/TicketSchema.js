const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  clientID: {
    type: Schema.Types.ObjectId,
  },
  openAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  status: {
    type: String,
    required: true,
    default: "در انتظار پاسخ اپراتور",
  },
  subject: {
    type: String,
    required: true,
    default: "",
  },
  conversations: [
    {
      sender: {
        type: String,
        required: true,
        default: "",
      },
      message: {
        type: String,
        required: true,
        default: "",
      },
      msgAt: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    },
  ],
});

module.exports = {
  TicketSchema: mongoose.model("ticket", TicketSchema),
};
