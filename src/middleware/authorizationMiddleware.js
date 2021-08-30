const { verifyAccessJWT } = require("../helper/jwtHelper");
const { getJWT, deleteJWT } = require("../helper/redisHelper");

const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;

  const decoded = await verifyAccessJWT(authorization);

  if (decoded.email) {
    const userId = await getJWT(authorization);
    console.log(userId);
    if (!userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.userId = userId;

    return next();
  }

  deleteJWT(authorization);

  return res.status(403).json({ message: "Forbidden" });
};

module.exports = {
  userAuthorization,
};
