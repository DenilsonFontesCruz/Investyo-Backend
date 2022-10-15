const passport = require("passport");
const AllowlistController = require("../controllers/allowlistController");
const BlocklistController = require("../controllers/blocklistController");
const UserController = require("../controllers/userController");
const ApplicationError = require("../errors/ApplicationError");

const verifyRefreshToken = async (refreshToken) => {
  try {
    if (!refreshToken)
      throw new ApplicationError("Refresh Token not sent", 403);
    const id = await AllowlistController.getUserId(refreshToken);
    if (!id) throw new ApplicationError("Invalid Refresh Token", 403);
    return id;
  } catch (err) {
    throw err;
  }
};

class authMiddleware {
  static localLogin = (req, res, next) => {
    //Function in src/auth/auth.js
    passport.authenticate(
      "login",
      { session: false },
      async (err, user, info) => {
        try {
          if (err) next(err);
          req.user = user;
          return next();
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  };

  static sendToken = async (req, res, next) => {
    try {
      if (!req.user) throw new ApplicationError("Invalid User", 403);

      const acessToken = "Bearer " + UserController.createAcessToken(req.user);
      const refreshToken = await UserController.createRefreshToken(req.user);

      res.set("Authorization", acessToken);
      return res.status(200).json({ refreshToken });
    } catch (err) {
      return next(err);
    }
  };

  static refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const id = await verifyRefreshToken(refreshToken);
      AllowlistController.removeRefreshToken(refreshToken);
      req.user = await UserController.findById(id);
      return next();
    } catch (err) {
      return next(err);
    }
  };

  static logout = async (req, res, next) => {
    try {
      const acessToken = req.header("Authorization").replace("Bearer ", "");

      BlocklistController.addAcessToken(acessToken);

      res.send("Sucessful Logout");
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = authMiddleware;
