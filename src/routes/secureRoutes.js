const UserController = require("../controllers/UserController");
const ApplicationError = require("../errors/ApplicationError");
const jwt = require("jsonwebtoken");
const BlocklistController = require("../controllers/blocklistController");
const authMiddleware = require("../auth/authMiddleware");
require("dotenv").config();

const router = require("express").Router();

router.get("/profile", (req, res, next) => {
  res.send(`<h1>Bem Vindo: ${req.user.username}</h1>`);
});

router.post("/logout", [authMiddleware.refreshToken, authMiddleware.logout]);


module.exports = router;
