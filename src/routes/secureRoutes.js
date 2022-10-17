const UserController = require("../controllers/UserController");
const ApplicationError = require("../errors/ApplicationError");
const InvalidArgumentError = require("../errors/InvalidArgumentError");
const jwt = require("jsonwebtoken");
const BlocklistController = require("../controllers/blocklistController");
const authMiddleware = require("../auth/authMiddleware");
const AssetController = require("../controllers/assetController");
require("dotenv").config();

const router = require("express").Router();

router.get("/profile", async (req, res, next) => {
  const user = await UserController.findById(req.user._id);
  const assets = await (await user.populate("assets")).assets;
  const formattedAssets = Promise.all(assets.map( async (i) => {
    return await AssetController.findAssetById(i);
  }))
  res.json(
    {
      username: user.username,
      balance: user.balance,
      assets
    }
  );
});

router.post("/logout", [authMiddleware.refreshToken, authMiddleware.logout]);

router.post("/change_balance", async (req, res, next) => {
  try {
    const { operationType, value } = req.body;
    if (!operationType || !value || isNaN(value)) {
      next(new InvalidArgumentError());
    }
    if (operationType !== "addFunds" && operationType !== "withdrawFunds") {
      next(new ApplicationError("Invalid Operation Type", 403));
    }
    await UserController[operationType](req.user._id, value);
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

    res.send("Ok")
  } catch (err) {
    next(err);
  }
});

module.exports = router;
