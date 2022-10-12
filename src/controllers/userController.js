const User = require("../models/User");
const bcrypt = require("bcrypt");
const ApplicationError = require("../errors/ApplicationError");
const ExchangeApi = require("../api/exchange");
const delay = require("delay");
require("dotenv").config();

class UserController {
  /*Register, Login, Log Out*/

  static createUser = async (username, password) => {
    try {
      if (await this.findByUsername(username)) {
        throw new ApplicationError("The user alredy exists", 409);
      }

      const hashPassword = await this.encryptPassword(password);
      const user = new User({ username, password: hashPassword, balance: 0 });

      return await user.save();
    } catch (err) {
      throw err;
    }
  };

  static findById = async (id) => {
    try {
      const user = await User.findById(id);

      return user;
    } catch (err) {
      throw err;
    }
  };

  static findByUsername = async (username) => {
    try {
      const user = await User.findOne({ username });

      return user;
    } catch (err) {
      throw err;
    }
  };

  static verifyPassword = async (password, hashPassword) => {
    try {
      return await bcrypt.compare(password, hashPassword);
    } catch (err) {
      throw err;
    }
  };

  static encryptPassword = async (password) => {
    try {
      const hashPassword = await bcrypt.hash(
        password,
        +process.env.ROUND_TIMES
      );
      return hashPassword;
    } catch (err) {
      throw err;
    }
  };

  static createToken = async (username) => {
    try {
      const body = { _id: user._id, username: user.username };
      const token = jwt.sign({ user: body }, process.env.SECRET_KEY, {
        expiresIn: "15m",
      });

      return token;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = UserController;
