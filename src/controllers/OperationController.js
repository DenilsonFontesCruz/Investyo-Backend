const FinancialApi = require("../api/financial.js");
const Operation = require("../models/Operation.js");
const ApplicationError = require("../errors/ApplicationError");
const ExchangeApi = require("../api/exchange.js");
const OperationGroups = require("../models/OperationGroup.js");
const OperationGroupController = require("./OperationGroupController.js");

class OperationController {
  static createOperation = async ({symbol, quantity, isItBuy, groupId}) => {
    try {
      if (quantity <= 0 || quantity > 10000) {
        throw new ApplicationError("Quantity is not allowed", 406);
      }

      const stockData = await FinancialApi.findBySymbol(symbol);
      if (stockData instanceof ApplicationError) throw stockData;
      const stockValue = stockData.stockValue;
      const category = stockData.category;

      const operation = new Operation({
        symbol,
        quantity,
        stockValue,
        category,
        isItBuy,
        group: groupId,
      });

      return operation;
    } catch (err) {
      throw err;
    }
  };

  

  static deleteOperation = async (operationId) => {
    try {
      await Operation.deleteOne({ _id: operationId });
    } catch (err) {
      throw err;
    }
  };

  static findById = async (id) => {
    try {
      const operation = await Operation.findById(id);
      return operation;
    } catch (err) {
      throw err;
    }
  };

  static formatOperation = async (operation, currency) => {
    try {
      // const ratio = await ExchangeApi.convertCurrency(value, currency);
      const ratio = 5;

      const symbol = operation.symbol;
      const quantity = operation.quantity;
      const category = operation.category;
      const data = await FinancialApi.findBySymbol(symbol);
      const currentValue = await this.currencyConvertOperation(
        data.stockValue,
        ratio
      );
      const purchaseValue = await this.currencyConvertOperation(
        operation.stockValue,
        ratio
      );
      const yieldValue = await this.currencyConvertOperation(
        (operation.stockValue - data.stockValue) * quantity,
        ratio
      );
      const totalValue = await this.currencyConvertOperation(
        data.stockValue * quantity,
        ratio
      );

      return {
        _id: operation._id,
        symbol,
        category,
        quantity,
        totalValue,
        yieldValue,
        purchaseValue,
        currentValue,
      };
    } catch (err) {
      throw err;
    }
  };

  static currencyConvertOperation = async (value, ratio) => {
    return value * ratio;
  };
}

module.exports = OperationController;
