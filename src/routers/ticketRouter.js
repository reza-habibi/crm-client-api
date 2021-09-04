const express = require("express");
const { insertTicket } = require("../model/ticket/TicketModel");

const router = express.Router();

router.all("/", (req, res, next) => {
  // res.json({message:'return from ticket router'})

  next();
});

router.post("/", async (req, res) => {
  try {
    const { subject, sender, message } = req.body;
    const ticketObj = {
      clientId: "612e08518aa5674ee29d7b55",
      subject,
      conversations: [
        {
          sender,
          message,
        },
      ],
    };

    const result = await insertTicket(ticketObj);
    if (result._id) {
      return res.json({ status: "success", message: "تیکت جدیدی ایجاد شد" });
    }

    res.json({
      status: "error",
      message: "امکان ایجاد کردن تیکت نمی باشد ، لطفا بعداً تلاش نمایید.",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
