const mongoose = require("mongoose");

const operationSchema = new mongoose.Schema({
    id: { type: String },
    symbol: { type: String, required: true },
    stockValue: { type: Number, required: true },
    quantity: { type: Number, required: true},
    operationDate: { type: Date, required: true}
  });

const operations = mongoose.model("operations", operationSchema);

module.exports = operations;