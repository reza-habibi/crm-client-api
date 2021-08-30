const express = require("express");
const router = express.Router();
const {
  insertUser,
  getUserByEmail,
  getUserById,
} = require("../model/user/userModel.js");
const { hashPassword, comparePassword } = require("../helper/bcryptHelper.js");
const { CreateAccessJWT, CreateRefreshJWT } = require("../helper/jwtHelper.js");
const {
  authorizationMiddleware,
  userAuthorization,
} = require("../middleware/authorizationMiddleware");
router.all("/", (req, res, next) => {
  //   res.json({ message: "return from user router" });
  next();
});

// user profile
router.get("/", userAuthorization, async (req, res) => {
  const _id = req.userId;

  const userProf = await getUserById(_id);
  console.log(userProf);

  res.json({ user: req.userId });
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

module.exports = router;
