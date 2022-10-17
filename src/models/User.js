const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  balance: {type: Number, required: true},
  assets: [{ type: mongoose.Schema.Types.ObjectId, ref: "assets" }],
});

const users = mongoose.model("users", userSchema);

module.exports = users;