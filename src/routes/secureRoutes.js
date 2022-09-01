const router = require("express").Router();

router.get("/profile", (req, res, next) => {
    res.send(`<h1>Bem Vindo: ${req.user.username}</h1>`);
});

module.exports = router;