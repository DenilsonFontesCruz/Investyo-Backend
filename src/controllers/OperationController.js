const FinancialApi = require('../api/financial.js');
const Operation = require('../models/Operation.js');
const ApplicationError = require("../errors/ApplicationError");

class OperationController{
    static createOperation = async(symbol, quantity) => {
       if (quantity <= 0 || quantity > 10000) return new ApplicationError("Quantity is not allowed", 406);

       const stockData = await FinancialApi.findBySymbol(symbol);
       if(stockData instanceof ApplicationError) return stockData;
       const stockValue = stockData.price;
       
       const operationDate = new Date(Date.now());

       const operation = new Operation({symbol, quantity, stockValue, operationDate});
       return await operation.save();
    }

}

module.exports = OperationController;