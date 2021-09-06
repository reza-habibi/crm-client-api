const express = require("express");
const router = express.Router();
const {
  insertUser,
  getUserByEmail,
  getUserById,
  updatePassword,
  storeUserRefreshJWT,
} = require("../model/user/userModel.js");
const { hashPassword, comparePassword } = require("../helper/bcryptHelper.js");
const { CreateAccessJWT, CreateRefreshJWT } = require("../helper/jwtHelper.js");
const { userAuthorization } = require("../middleware/authorizationMiddleware");
const {
  setResetPassPin,
  getPinByEmailPin,
  deletePin,
} = require("../model/resetPin/ResetPinModel.js");
const { emailProcessor } = require("../helper/emailHelper.js");
const {
  resetPassReqValidation,
  updatePassValidation,
} = require("../middleware/formValidationMiddleware.js");
const { deleteJWT } = require("../helper/redisHelper.js");
router.all("/", (req, res, next) => {
  //   res.json({ message: "return from user router" });
  next();
});

// user profile
router.get("/", userAuthorization, async (req, res) => {
  const _id = req.userId;

  const userProf = await getUserById(_id);
  const { name, email } = userProf;

  res.json({ user: { _id, name, email } });
});

// Create new user route
router.post("/", async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;
  try {
    const hashedPass = await hashPassword(password);

    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPass,
    };

    const result = await insertUser(newUserObj);
    res.json({ message: " حساب کاربری جدید ساخته شد", result });
    console.log(result);
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});

// user sign in route

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      status: "error",
      message: "اطلاعات فرم به درستی تکمیل نشده است !",
    });
  }

  const user = await getUserByEmail(email);

  const passFromDb = user && user._id ? user.password : null;

  if (!passFromDb)
    return res.json({
      status: "error",
      message: "ایمیل یا رمز عبور اشتباه است !",
    });

  const result = await comparePassword(password, passFromDb);

  if (!result) {
    return res.json({
      status: "error",
      message: "ایمیل یا رمز عبور اشتباه است !",
    });
  }

  const accessJWT = await CreateAccessJWT(user.email, `${user._id}`);
  const refreshJWT = await CreateRefreshJWT(user.email, user._id);

  res.json({
    status: "success",
    message: "با موفقیت وارد شد",
    accessJWT,
    refreshJWT,
  });
});

router.post("/reset-password", resetPassReqValidation, async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);

  if (user && user._id) {
    const setPin = await setResetPassPin(email);
    await emailProcessor({
      email,
      pin: setPin.pin,
      type: "request_new_password",
    });

    return res.json({
      status: "success",
      message:
        "اگر ایمیل در پایگاه داده ما موجود باشد ، رمز بازیابی کلمه عبور به زودی برای شما ارسال می شود",
    });
  }

  res.json({
    status: "error",
    message:
      "اگر ایمیل در پایگاه داده ما موجود باشد ، رمز بازیابی کلمه عبور به زودی برای شما ارسال می شود",
  });
});

router.patch("/reset-password", updatePassValidation, async (req, res) => {
  const { email, pin, newPassword } = req.body;
  const getPin = await getPinByEmailPin(email, pin);
  if (getPin?._id) {
    const dbDate = getPin.addedAt;
    const expiresIn = 1;

    let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);

    const today = new Date();

    if (today > expDate) {
      return res.json({
        status: "error",
        message: "رمز نامعتبر یا منقضی شده است",
      });
    }
  }
  const hashedPass = await hashPassword(newPassword);

  const user = await updatePassword(email, hashedPass);

  if (user._id) {
    await emailProcessor({ email, type: "update_password" });
    await deletePin(email, pin);
    return res.json({
      status: "success",
      message: "کلمه عبور شما به روز رسانی شد",
    });
  }

  res.json({
    status: "error",
    message:
      "در حال حاضر امکان به روز رسانی میسر نیست ، لطفاً بعداً تلاس نمایید",
  });
});

router.delete("/logout", userAuthorization, async (req, res) => {
  const { authorization } = req.headers;
  const _id = req.userId;

  deleteJWT(authorization);
  const result = await storeUserRefreshJWT(_id, "");

  res.json({ user: req.userId });
});

module.exports = router;
