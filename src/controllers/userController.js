const User = require("../models/User");
const bcrypt = require("bcrypt");
const ApplicationError = require("../errors/ApplicationError");
require("dotenv").config();

class UserController {
  static createUser = async (username, password) => {
    if (!((await this.findByUsername(username)) instanceof ApplicationError)) {
      return new ApplicationError("The user alredy exists", 409);
    }

    const hashPassword = await this.encryptPassword(password);
    const user = new User({ username, password: hashPassword });
    return await user.save();
  };

  static findById = async (id) => {
    const user = await User.findById(id);
    if (!user) return new ApplicationError("User not found", 404);
    return user;
  };

  static findByUsername = async (username) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return new ApplicationError("User not found", 404);
      return user;
    } catch (err) {
      console.error(err);
    }
  };

  static verifyPassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
  };

  static encryptPassword = async (password) => {
    const hashPassword = await bcrypt.hash(password, +process.env.ROUND_TIMES);
    return hashPassword;
  };
}

module.exports = UserController;
