const UserController = require("../controllers/UserController");
const ApplicationError = require("../errors/ApplicationError");

const router = require("express").Router();

router.get("/profile", (req, res, next) => {
  res.send(`<h1>Bem Vindo: ${req.user.username}</h1>`);
});

router.post("/operation", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { symbol, quantity } = req.body;
    if (symbol == null || quantity == null)
      return next(new ApplicationError("Data missing", 406));
    const result = await UserController.createOperation(
      { symbol, quantity },
      userId
    );
    res.send(result);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.put("/operation", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { operationId, quantity } = req.body;
    if (operationId == null || quantity == null)
      return next(new ApplicationError("Data missing", 406));
    const result = await UserController.editOperation(
      { operationId, quantity },
      userId
    );
    res.send(result);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.get("/operation", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const currency = req.headers.currency;
    const result = await UserController.getUserWallet(userId, currency);
    res.send(result);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
