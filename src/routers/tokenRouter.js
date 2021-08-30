const express = require("express");
const router = express.Router();

const { verifyRefreshJWT, CreateAccessJWT } = require("../helper/jwtHelper");
const { getUserByEmail } = require("../model/user/userModel");

//return refresh jwt
router.get("/", async (req, res, next) => {
  const { authorization } = req.headers;

  //TODO

  const decoded = await verifyRefreshJWT(authorization);
  console.log(decoded);

  console.log(decoded.email);
  if (decoded.email) {
    const userProf = await getUserByEmail(decoded.email);

    if (userProf._id) {
      console.log(userProf._id);
      let tokenExp = userProf.refreshJWT.addedAt;
      const dbRefreshToken = userProf.refreshJWT.token;

      tokenExp = tokenExp.setDate(
        tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
      );

      const today = new Date();

      if (dbRefreshToken !== authorization && tokenExp < today) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const accessJWT = await CreateAccessJWT(
        decoded.email,
        userProf._id.toString()
      );

      return res.json({ status: "success", accessJWT });
    }
  }

  res.status(403).json({ message: "Forbidden" });
});

module.exports = router;
