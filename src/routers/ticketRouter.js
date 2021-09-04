const express = require("express");
const { userAuthorization } = require("../middleware/authorizationMiddleware");
const { insertTicket, getTickets } = require("../model/ticket/TicketModel");

const router = express.Router();

router.all("/", (req, res, next) => {
  // res.json({message:'return from ticket router'})

  next();
});

router.post("/", userAuthorization, async (req, res) => {
  try {
    const { subject, sender, message } = req.body;
    const ticketObj = {
      clientId: req.userId,
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

router.get("/", userAuthorization, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await getTickets(userId);
    if (result.length) {
      return res.json({ status: "success", result });
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
