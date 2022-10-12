const mongoose = require("mongoose");

const assetGroupSchema = new mongoose.Schema({
  id: { type: String },
  symbol: { type: String },
  quantity: { type: Number },
  stockValueAverage: { type: Number },
  totalValue: { type: Number },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const assets = mongoose.model("assets", assetGroupSchema);

module.exports = assets;
