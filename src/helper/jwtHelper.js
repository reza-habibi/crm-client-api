const jwt = require("jsonwebtoken");
const { setJWT, getJWT } = require("./redisHelper");
const CreateAccessJWT = async (paylaod) => {
  try {
    const accessJWT = jwt.sign({ paylaod }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });

    await setJWT(accessJWT);

    return Promise.resolve(accessJWT);
  } catch (error) {
    return Promise.reject(error);
  }
};

const CreateRefreshJWT = (paylaod) => {
  const refreshJWT = jwt.sign({ paylaod }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return Promise.resolve(refreshJWT);
};

module.exports = { CreateAccessJWT, CreateRefreshJWT };
