const router = require('express').Router();
const financialApi = require('../api/financial.js')
const UserController = require('../controllers/userController.js')

router.get("/", (req, res, next) => {
    res.send(`<h1>Test</h1>`);
}); 

router.get("/stocks", financialApi.getStocks)
router.post("/register", UserController.createUser)

module.exports = router;