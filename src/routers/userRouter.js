const express = require("express");
const router = express.Router();
const { insertUser } = require("../model/user/userModel");
const {hashPassword} = require("../helper/bcryptHelper.js");
router.all("/", (req, res, next) => {
  //   res.json({ message: "return from user router" });
  next();
});

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

module.exports = router;
