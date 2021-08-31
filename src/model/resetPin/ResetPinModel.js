const randomPinGenerator = require("../../utils/randomGenerator");
const ResetPass = require("./ResetPinSchema");

const setResetPassPin = async (email) => {
  const pinLength = 7;
  const randPin = await randomPinGenerator(pinLength);

  const resetObj = {
    email,
    pin: randPin,
  };
  return new Promise((resolve, reject) => {
    ResetPass(resetObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

module.exports = {
  setResetPassPin,
};
