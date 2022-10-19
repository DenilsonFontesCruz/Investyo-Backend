const mongoose = require("mongoose");

const extractSchema = new mongoose.Schema({
  id: { type: String },
  issueDate: { type: Date },
  value: { type: Number },
  type: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const extracts = mongoose.model("extracts", extractSchema);

module.exports = extracts;
