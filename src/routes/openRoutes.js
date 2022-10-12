const router = require("express").Router();
const FinancialApi = require("../api/financial.js");
const UserController = require("../controllers/UserController.js");
const passport = require("passport");
const ApplicationError = require("../errors/ApplicationError.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/", (req, res, next) => {
  res.send(`<h1>Test</h1>`);
});

router.post("/stocks", async (req, res, next) => {
  const { symbol, quantity } = req.body;
  const operation = await OperationController.createOperation(symbol, quantity);
  if (operation instanceof ApplicationError) return next(operation);
  res.status(200).send(operation);
});

router.post(
  "/register",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.json({
      user: req.user,
    });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user)
        return next(err || new ApplicationError("An error occurred.", 500));

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const token = "Bearer " + await UserController.createToken(user);

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;
