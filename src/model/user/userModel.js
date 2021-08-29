const User = require("./userSchema");

const insertUser = (userObj) => {
  return new Promise((resolve, reject) => {
    User(userObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    if (!email) return false;

    try {
      User.findOne({ email }, (error, data) => {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  insertUser,
  getUserByEmail,
};
