const UserController = require("../controllers/UserController");
const ApplicationError = require("../errors/ApplicationError");
const jwt = require("jsonwebtoken");
const BlacklistController = require("../controllers/blacklistController");
require("dotenv").config();

const router = require("express").Router();

router.get("/profile", (req, res, next) => {
  res.send(`<h1>Bem Vindo: ${req.user.username}</h1>`);
});

router.get("/logout", async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace('Bearer ', '')
    
    BlacklistController.addTokenInUserList(token);
     
    res.send("Sucessful Logout");

  }catch(err) {
    return next(err);
  }
});


module.exports = router;
