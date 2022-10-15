const router = require("express").Router();
const FinancialApi = require("../api/financial.js");
const UserController = require("../controllers/UserController.js");
const passport = require("passport");
const ApplicationError = require("../errors/ApplicationError.js");
const authMiddleware = require("../auth/authMiddleware.js");
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

router.post("/login", [authMiddleware.localLogin, authMiddleware.sendToken]);

router.post("/refresh", [authMiddleware.refreshToken, authMiddleware.sendToken]);

module.exports = router;
