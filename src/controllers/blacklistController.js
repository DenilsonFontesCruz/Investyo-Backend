const blacklist = require("../database/redisDB");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const tokenHashGenerate = async (token) => {
  return await crypto.createHash("sha256").update(token).digest("hex");
};

class BlacklistController {
  static addTokenInUserList = async (token) => {
    try {
      const expirationDate = jwt.decode(token).exp;
      const tokenHash = await tokenHashGenerate(token);
      await blacklist.set(tokenHash, "");
      await blacklist.expireAt(tokenHash, expirationDate);
    } catch (err) {
      throw err;
    }
  };

  static containToken = async (token) => {
    try {
      const tokenHash = await tokenHashGenerate(token);
      const result = await blacklist.exists(tokenHash);
      return result == 1;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = BlacklistController;
