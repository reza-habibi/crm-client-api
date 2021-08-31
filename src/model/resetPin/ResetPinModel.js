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

const getPinByEmailPin = (email, pin) => {
  return new Promise((resolve, reject) => {
    try {
      ResetPass.findOne({ email, pin }, (error, data) => {
        if (error) {
          resolve(false);
        } else {
          resolve(data);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deletePin = (email, pin) => {
  try {
    ResetPass.findOneAndDelete({ email, pin }, (error, data) => {
      if (error) {
        console.log(error);
      }
    });
  } catch (error) {
    reject(error);
  }
};

module.exports = {
  setResetPassPin,
  getPinByEmailPin,
  deletePin,
};
