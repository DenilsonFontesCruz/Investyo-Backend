const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  balance: {type: Number, required: true},
  operationGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "operationGroups" }],
});

const users = mongoose.model("users", userSchema);

module.exports = users;