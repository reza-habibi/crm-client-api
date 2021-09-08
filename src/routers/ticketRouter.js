const express = require("express");
const { userAuthorization } = require("../middleware/authorizationMiddleware");
const {
  createNewTicketValidation,
  replyTicketMessageValidation,
} = require("../middleware/formValidationMiddleware");
const {
  insertTicket,
  getTickets,
  getTicketById,
  updateClientReply,
  updateStatusClose,
  deleteTicket,
} = require("../model/ticket/TicketModel");

const router = express.Router();

router.all("/", (req, res, next) => {
  // res.json({message:'return from ticket router'})

  next();
});

router.post(
  "/",
  createNewTicketValidation,
  userAuthorization,
  async (req, res) => {
    try {
      const { subject, sender, message } = req.body;
      const userId = req.userId;

      const ticketObj = {
        clientId: userId,
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
  }
);

router.get("/", userAuthorization, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await getTickets(userId);
    if (result.length) {
      return res.json({ status: "success", result });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await getTicketById(_id, clientId);
    if (result.length) {
      return res.json({ status: "success", result });
    }
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

router.put(
  "/:_id",
  replyTicketMessageValidation,
  userAuthorization,
  async (req, res) => {
    try {
      const { message, sender } = req.body;
      const { _id } = req.params;
      console.log(_id);
      console.log(req.body);
      const result = await updateClientReply({ _id, message, sender });
      if (result._id) {
        return res.json({ status: "success", message: "پیام شما ثبت شد" });
      }
      return res.json({
        status: "error",
        message:
          "در حال حاضر امکان ثبت پیام شما وجود ندارد ، لطفاً بعداً تلاش نمایید",
      });
    } catch (error) {
      res.json({
        status: "error",
        message: error.message,
      });
    }
  }
);

router.patch("/close-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await updateStatusClose({ _id, clientId });
    if (result._id) {
      return res.json({
        status: "success",
        message: "تیکت با موفقیت بسته شد.",
      });
    }
    return res.json({
      status: "error",
      message:
        "در حال حاضر امکان به روزرسانی وجود ندارد ، لطفاً بعداً تلاش نمایید",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

router.delete("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await deleteTicket({ _id, clientId });
    if (result._id) {
      return res.json({
        status: "success",
        message: "تیکت با موفقیت حذف گردید.",
      });
    }
    return res.json({
      status: "error",
      message: "در حال حاضر امکان حذف وجود ندارد ، لطفاً بعداً تلاش نمایید",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});
module.exports = router;
