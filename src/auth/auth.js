const passport = require("passport");
const BlocklistController = require("../controllers/blocklistController");
const localStrategy = require("passport-local").Strategy;
const userController = require("../controllers/userController");
const ApplicationError = require("../errors/ApplicationError");
const BearerStrategy = require("passport-http-bearer").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await userController.createUser(username, password);

        if (user instanceof ApplicationError) done(user);
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false,
    },
    async (username, password, done) => {
      try {
        const user = await userController.findByUsername(username);
        if (!user) throw new ApplicationError("User not found", 404);

        const passwordIsValid = await userController.verifyPassword(
          password,
          user.password
        );

        if (!passwordIsValid)
          return done(new ApplicationError("Wrong password", 403));

        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new BearerStrategy(async (acessToken, done) => {
    try {
      if (await BlocklistController.containAcessToken(acessToken)) {
        done(new ApplicationError("acessToken Invalid", 401));
      }
      const payload = jwt.verify(acessToken, process.env.SECRET_KEY);
      const user = payload.user;
      return done(null, user);
    } catch (error) {
      if (error.name == "TokenExpiredError")
        return done(new ApplicationError("Token Expired", 404));
      done(error);
    }
  })
);
