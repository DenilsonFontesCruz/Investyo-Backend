const mongoose = require("mongoose");

const operationGroupSchema = new mongoose.Schema({
  id: { type: String },
  symbol: { type: String },
  quantity: { type: Number },
  stockValueAverage: { type: Number },
  totalValue: { type: Number },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  operations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "operations",
    },
  ],
});

const operationGroups = mongoose.model("operationGroups", operationGroupSchema);

module.exports = operationGroups;
