const allowlist = require("../database/Redis/redisAllowlist-RefreshToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const tokenHashGenerate = async (token) => {
  return await crypto.createHash("sha256").update(token).digest("hex");
};

class AllowlistController {
  static addRefreshToken = async (refreshToken, expirationDate, userId) => {
    try {
      const refreshTokenHash = await tokenHashGenerate(refreshToken);
      await allowlist.set(refreshTokenHash, userId);
      await allowlist.expireAt(refreshTokenHash, expirationDate);
    } catch (err) {
      throw err;
    }
  };

  static containRefreshToken = async (refreshToken) => {
    try {
      const refreshTokenHash = await tokenHashGenerate(refreshToken);
      return (await allowlist.exists(refreshTokenHash)) === 1;
    } catch (err) {
      throw err;
    }
  };

  static getUserId = async (refreshToken) => {
    try {
      const refreshTokenHash = await tokenHashGenerate(refreshToken);
      return await allowlist.get(refreshTokenHash);
    } catch (err) {
      throw err;
    }
  };

  static removeRefreshToken = async (refreshToken) => {
    try {
      const refreshTokenHash = await tokenHashGenerate(refreshToken);
      await allowlist.del(refreshTokenHash);
    } catch(err) {
      throw err;
    }
  }
}

module.exports = AllowlistController;
