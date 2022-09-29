const mongoose = require("mongoose");

const operationSchema = new mongoose.Schema({
  id: { type: String },
  symbol: { type: String, required: true },
  stockValue: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String },
  isItBuy: {type: Boolean},
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "operationGroups",
  }
});

const operations = mongoose.model("operations", operationSchema);

module.exports = operations;
