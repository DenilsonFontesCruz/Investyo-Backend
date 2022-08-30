const User = require("../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();

class UserController {
  static createUser = async (req, res) => {
    const { username, password } = req.body;
    const hashPassword = await this.encryptPassword(password);
    console.log(hashPassword);
    const user = new User({ username, password: hashPassword });
    user.save((err, user) => {
      if (err) return res.status(500).send(err);
      else res.status(201).send(user);
    });
  }

  static findByUsername = async (username) => {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send("User not found");
    return user;
  }

  static verifyPassword = async (password, hashPassword) => {
    return bcrypt.compare(password, hashPassword);
  }

  static encryptPassword = async (password) => {
    const hashPassword = await bcrypt.hash(password, +process.env.ROUND_TIMES);
    return hashPassword;
  }
}

module.exports = UserController;
