const FinancialApi = require("../api/financial.js");
const Operation = require("../models/Operation.js");
const ApplicationError = require("../errors/ApplicationError");
const ExchangeApi = require("../api/exchange.js");
const OperationGroups = require("../models/OperationGroup.js");
const operationGroups = require("../models/OperationGroup.js");
const OperationController = require("./OperationController.js");

class OperationGroupController {
  static createGroup = async ({ symbol, userId }) => {
    try {
      const group = new operationGroups({
        symbol,
        quantity: 0,
        stockValueAverage: 0,
        totalValue: 0,
        user: userId,
        operations: [],
      });

      return group;
    } catch (err) {
      throw err;
    }
  };

  static updateGroup = async ({ symbol, quantity, isItBuy }) => {
    try {
      const group = await this.findGroup(symbol);
      if (!group) throw new ApplicationError("Group not found", 404);

      if (!isItBuy && quantity > group.quantity) {
        throw new ApplicationError("Invalid quantity", 406);
      }

      const values = await this.valuesDefinition(
        isItBuy,
        quantity,
        group,
        stockValue
      );

      const totalValue = values.stockValueAverage * values.totalQuantity;

      group.quantity = values.totalQuantity;
      group.stockValueAverage = values.stockValueAverage;
      group.totalValue = totalValue;
      group.operations.push(operation);

      return await group.save();
    } catch (err) {
      throw err;
    }
  };

  static valuesDefinition = async ({
    isItBuy,
    quantity,
    group,
    stockValue,
  }) => {
    try {
      if (isItBuy) {
        const totalQuantity = quantity + group.quantity;
        const stockValueAverage =
          (stockValue * quantity + group.totalValue) / totalQuantity;

        const operation = await this.buyOperation(symbol, quantity);

        return {
          totalQuantity,
          stockValueAverage,
          operation,
        };
      } else {
        const totalQuantity = group.quantity - quantity;
        const stockValueAverage =
          (group.totalValue - stockValue * quantity) / totalQuantity;

        const operation = await this.sellOperation(symbol, quantity);

        return {
          totalQuantity,
          stockValueAverage,
          operation,
        };
      }
    } catch (err) {
      throw err;
    }
  };

  static sellOperation = async (symbol, quantity) => {
    try {
      const group = await this.findGroup(symbol);

      if (!group)
        throw new ApplicationError(
          `User does not own any stock of ${symbol}`,
          406
        );

      const operation = OperationController.createOperation({
        symbol,
        quantity,
        isItBuy: false,
        groupId: group.id,
      });

      
    } catch (err) {
      throw err;
    }
  };

  static buyOperation = async (symbol, quantity, groupId) => {
    try {
      this.createOperation(symbol, quantity, true, groupId);
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
