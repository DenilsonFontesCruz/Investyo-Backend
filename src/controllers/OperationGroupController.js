const FinancialApi = require("../api/financial.js");
const Operation = require("../models/Operation.js");
const ApplicationError = require("../errors/ApplicationError");
const ExchangeApi = require("../api/exchange.js");
const OperationGroups = require("../models/operationGroup.js");

class OperationGroupController {
    static updateGroup = async ({symbol, quantity, stockValue, isItBuy, operation}) => {
        try {
          const group = await this.findGroup(symbol);
          if (!group) throw new ApplicationError("Group not found", 404);
    
          if (!isItBuy && quantity > group.quantity) {
            throw new ApplicationError("Invalid quantity", 406);
          }
          let totalQuantity;
          let stockValueAverage;
    
          if (isItBuy) {
            totalQuantity = quantity + group.quantity;
            stockValueAverage =
              (stockValue * quantity + group.totalValue) / totalQuantity;
          } else {
            totalQuantity = group.quantity - quantity;
            stockValueAverage =
              (group.totalValue - stockValue * quantity) / totalQuantity;
          }
    
          const totalValue = stockValueAverage * totalQuantity;
    
          group.quantity = totalQuantity;
          group.stockValueAverage = stockValueAverage;
          group.totalValue = totalValue;
          group.operations.push(operation);
    
          return await group.save();
        } catch (err) {
          throw err;
        }
      };
    
      static findGroup = async (symbol) => {
        try {
          return await OperationGroups.findOne({ symbol });
        } catch (err) {
          throw err;
        }
      };

      static createGroup = async (symbol, userId) => {
        try {
          const group = new OperationGroup({
            symbol,
            quantity: 0,
            stockValueAverage: 0,
            totalValue: 0,
            user: userId,
          });
          return await group.save;
        } catch (err) {
          throw err;
        }
      };
}

module.exports = OperationGroupController;