const UserController = require("../controllers/UserController");
const ApplicationError = require("../errors/ApplicationError");
const redisDB = require("../database/redisDB");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = require("express").Router();

router.get("/profile", (req, res, next) => {
  res.send(`<h1>Bem Vindo: ${req.user.username}</h1>`);
});

router.get("/logout", async (req, res, next) => {
  try {
    
    const token = req.header("Authorization").replace('Bearer ', '')
    const userId = req.user._id;
    
    redisDB.get(userId, (error, data) => {
      if(error) next(error);
      console.log(data);
    });


     
    res.send(token);

  }catch(err) {
    return next(err);
  }
});


module.exports = router;
