const User = require("../models/User");
const bcrypt = require("bcrypt");
const ApplicationError = require("../errors/ApplicationError");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const moment = require("moment");
const AllowlistController = require("./allowlistController");
require("dotenv").config();

const encryptPassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, +process.env.ROUND_TIMES);
    return hashPassword;
  } catch (err) {
    throw err;
  }
};

const changeBalance = async (user, value) => {
  try {
    if (value < -20000 || value === 0 || value > 20000) {
      throw new ApplicationError("Invalid Value", 403);
    }
    const newBalance = user.balance + value;
    if (newBalance < 0) {
      throw new ApplicationError("Insufficient funds in Account", 403);
    }
    user.balance = newBalance;

    return user;
  } catch (err) {
    throw err;
  }
};

class UserController {
  static createUser = async (username, password) => {
    try {
      if (await this.findByUsername(username)) {
        throw new ApplicationError("The user alredy exists", 409);
      }

      const hashPassword = await encryptPassword(password);
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

  static createAcessToken = (user) => {
    try {
      const userId = user._id.toString();
      const body = { _id: userId, username: user.username };
      const acessToken = jwt.sign({ user: body }, process.env.SECRET_KEY, {
        expiresIn: "1m",
      });

      return acessToken;
    } catch (err) {
      throw err;
    }
  };

  static createRefreshToken = async (user) => {
    try {
      const refreshToken = crypto.randomBytes(24).toString("hex");
      const expirationDate = await moment().add(5, "d").unix();
      AllowlistController.addRefreshToken(
        refreshToken,
        expirationDate,
        user._id.toString()
      );
      return refreshToken;
    } catch (err) {
      throw err;
    }
  };

  static addFunds = async (userId, value) => {
    try {
      const user = await UserController.findById(userId);
      return await changeBalance(user, value);
    } catch (err) {
      throw err;
    }
  };

  static withdrawFunds = async (userId, value) => {
    try {
      const user = await UserController.findById(userId);
      return await changeBalance(user, -value);
    } catch (err) {
      throw err;
    }
  };
}

module.exports = UserController;
