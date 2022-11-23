const UserController = require("../controllers/UserController");
const ApplicationError = require("../errors/ApplicationError");
const InvalidArgumentError = require("../errors/InvalidArgumentError");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../auth/authMiddleware");
const AssetController = require("../controllers/assetController");
const ExtractController = require("../controllers/extractController");
require("dotenv").config();

const router = require("express").Router();

router.get("/profile/wallet", async (req, res, next) => {
  try {
    const user = await UserController.findById(req.user._id);
    const assetController = new AssetController(user);
    const assets = await assetController.getAllAssetsOfUser();
    const totalValue = await assetController.getTotalValue(assets);
    res.json({
      username: user.username,
      balance: user.balance,
      assets,
      totalValue
    });
  } catch (err) {
    next(err);
  }
});

router.get("/profile/", async (req, res, next) => {
  try {
    const user = await UserController.findById(req.user._id);
    res.json({
      username: user.username,
      balance: user.balance,
    });
  } catch (err) {
    next(err);
  }
})

router.get("/profile/extract", async (req, res, next) => {
  try {
    const user = await UserController.findById(req.user._id);
    const extractController = new ExtractController(user);
    const extracts = await extractController.getAllExtractsOfUser();
    res.json({
      username: user.username,
      extracts,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", [authMiddleware.refreshToken, authMiddleware.logout]);

router.get("/api/search_name", async (req, res, next) => {
  try {
    const name = req.query.name;
    if (!name) {
      next(new InvalidArgumentError());
    }
    const companyList = await AssetController.searchCompanyByName(name);
    res.json({ companyList });
  } catch (err) {
    next(err);
  }
});

router.post("/change_balance", async (req, res, next) => {
  try {
    const { operationType, value } = req.body;
    if (!operationType || !value || isNaN(value) || !(typeof value === "number")) {
      next(new InvalidArgumentError());
    }
    if (operationType !== "addFunds" && operationType !== "withdrawFunds") {
      next(new ApplicationError("Invalid Operation Type", 403));
    }
    const user = await UserController.findById(req.user._id);
    const extractController = new ExtractController(user);

    const updatedUser = await UserController[operationType](
      req.user._id,
      value
    );
    const extract = await extractController.createExtract(value, operationType);
    updatedUser.extracts.push(extract);

    await updatedUser.save();
    res.status(200).send("Operation completed successfully");
  } catch (err) {
    next(err);
  }
});

router.post("/perform_operation", async (req, res, next) => {
  try {
    const { symbol, operationType, quantity } = req.body;
    if (!symbol || !operationType || !quantity || isNaN(quantity)) {
      next(new InvalidArgumentError());
    }
    if (operationType !== "buyAsset" && operationType !== "sellAsset") {
      next(new ApplicationError("Invalid Operation Type", 403));
    }
    const user = await UserController.findById(req.user._id);
    const assetController = new AssetController(user);

    await assetController[operationType](symbol, quantity);

    res.send("Ok");
  } catch (err) {
    next(err);
  }
});

router.get("/api/historical_values", async (req, res, next) => {
  try {
    const days = req.query.days;
    const symbol = req.query.symbol;
    if (!days || isNaN(days) || days <= 0 || !symbol) {
      next (new InvalidArgumentError());
    }
    const listOfValues = await AssetController.getHistoricalValues(days, symbol);

    res.send(listOfValues);
  } catch (err) {
    next(err);
  }
})

module.exports = router;
