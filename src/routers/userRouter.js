const express = require("express");
const router = express.Router();
const { insertUser, getUserByEmail } = require("../model/user/userModel");
const { hashPassword, comparePassword } = require("../helper/bcryptHelper.js");
router.all("/", (req, res, next) => {
  //   res.json({ message: "return from user router" });
  next();
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
  console.log(result);
  res.json({
    status: "success",
    message: "با موفقیت وارد شد",
  });
});

module.exports = router;
