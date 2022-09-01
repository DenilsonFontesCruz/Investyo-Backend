const router = require("express").Router();
const financialApi = require("../api/financial.js");
const UserController = require("../controllers/userController.js");
const passport = require("passport");
const ApplicationError = require("../errors/ApplicationError.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/", (req, res, next) => {
  res.send(`<h1>Test</h1>`);
});

router.get("/stocks", financialApi.getStocks);
router.post(
  "/register",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.json({
      user: req.user,
    });
  }
);

router.post("/login", 
async (req, res, next) => {
  passport.authenticate(
    "login",
  async (err, user, info) => {
    try {
      if (err || !user) return next(err ||new ApplicationError('An error occurred.', 500));

      req.login(
        user,
        { session: false },
        async (error) => {
          if (error) return next(error);

          const body = { _id: user._id, username: user.username };
          const token = jwt.sign({ user: body }, process.env.SECRET_KEY);

          return res.json({ token });
        }
      );
    }catch(error) {
      return next(error);
    }
  }
  )(req, res, next);
});


module.exports = router;
