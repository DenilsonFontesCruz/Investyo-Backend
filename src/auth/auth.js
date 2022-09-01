const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const userController = require("../controllers/userController");
const ApplicationError = require("../errors/ApplicationError");
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
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
    },
    async (username, password, done) => {
      try {
        const user = await userController.findByUsername(username);
        if (user instanceof ApplicationError) done(user);

        const passwordIsValid = await userController.verifyPassword(
          password,
          user.password
        );

        if(!passwordIsValid) return done(new ApplicationError("Wrong password", 403));

        return done(null, user);

      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJWT.fromHeader("authorization")
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);