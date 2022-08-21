const router = require('express').Router();
const financialApi = require('../api/financial.js')


router.get("/", (req, res, next) => {
    res.send(`<h1>Test</h1>`);
}); 

router.get("/stocks", financialApi.getStocks)

module.exports = router;