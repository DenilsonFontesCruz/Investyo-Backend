const blocklist = require("../database/Redis/redisBlocklist-AcessToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const tokenHashGenerate = async (token) => {
  return await crypto.createHash("sha256").update(token).digest("hex");
};

class BlocklistController {
  static addAcessToken = async (acessToken) => {
    try {
      const expirationDate = jwt.decode(acessToken).exp;
      const acessTokenHash = await tokenHashGenerate(acessToken);
      await blocklist.set(acessTokenHash, "");
      await blocklist.expireAt(acessTokenHash, expirationDate);
    } catch (err) {
      throw err;
    }
  };

  static containAcessToken = async (acessToken) => {
    try {
      const acessTokenHash = await tokenHashGenerate(acessToken);
      const result = await blocklist.exists(acessTokenHash);
      return result == 1;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = BlocklistController;
