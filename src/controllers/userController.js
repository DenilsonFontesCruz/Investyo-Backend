const User = require("../models/User");
const bcrypt = require("bcrypt");
const ApplicationError = require("../errors/ApplicationError");
const OperationController = require("./OperationController");
const ExchangeApi = require("../api/exchange");
const delay = require("delay");
require("dotenv").config();

class UserController {
  /*Register and Login*/

  static createUser = async (username, password) => {
    try {
      if (await this.findByUsername(username)) {
        throw new ApplicationError("The user alredy exists", 409);
      }

      const hashPassword = await this.encryptPassword(password);
      const user = new User({ username, password: hashPassword, balance: 0 });

      return await user.save();
    } catch (err) {
      throw err;
    }
  };

  static findById = async (id) => {
    try {
      const user = await User.findById(id);

      return user;
    } catch (err) {
      throw err;
    }
  };

  static findByUsername = async (username) => {
    try {
      const user = await User.findOne({ username });

      return user;
    } catch (err) {
      throw err;
    }
  };

  static verifyPassword = async (password, hashPassword) => {
    try {
      return await bcrypt.compare(password, hashPassword);
    } catch (err) {
      throw err;
    }
  };

  static encryptPassword = async (password) => {
    try {
      const hashPassword = await bcrypt.hash(
        password,
        +process.env.ROUND_TIMES
      );
      return hashPassword;
    } catch (err) {
      throw err;
    }
  };

  /*Operations*/

  static createOperation = async ({ symbol, quantity }, userId) => {
    try {
      const operation = await OperationController.createOperation({
        symbol,
        quantity,
        userId,
      });

      const operationTotalValue = operation.stockValue * operation.quantity;

      const user = await this.findById(userId);
      user.operations.push(operation);

      return await user.save();
    } catch (err) {
      throw err;
    }
  };

  static existsSymbolInWallet = async (symbol, userId) => {
    try {
      const operations = await this.findAllOperations(userId);
      const filteredOperations = operations.filter((i) => {
        if(i.symbol == symbol) return true;
      });
      return filteredOperations;
    } catch (err) {
      throw err;
    }
  };

  

  // static editOperation = async ({ quantity, operationId }, userId) => {
  //   try {
  //     const oldOperation = await OperationController.findById(operationId);
  //     const stockValue = oldOperation.stockValue;
  //     const oldQuantity = oldOperation.quantity;

  //     if (quantity === 0) {
  //       await OperationController.deleteOperation(operationId);

  //       const operationTotalValue = stockValue * oldQuantity;
  //     } else {
  //       const operation = await OperationController.updateOperation(
  //         operationId,
  //         quantity
  //       );

  //       const operationTotalValue =
  //         stockValue * (oldQuantity - operation.quantity);

  //       const user = await this.findById(userId);
  //       user.operations.push(operation);

  //       return await user.save();
  //     }
  //   } catch (err) {
  //     throw err;
  //   }
  // };

  /*Wallet*/

  static findAllOperations = async (userId) => {
    try {
      const user = await this.findById(userId);
      const result = await user.populate("operations");
      return (await result.toObject()).operations;
    } catch (err) {
      throw err;
    }
  };

  static getUserWallet = async (userId, currency) => {
    try {
      this.existsSymbolInWallet("AAPL", userId);
      const rawOperations = await this.findAllOperations(userId);

      const operationsFormatted = await Promise.all(
        rawOperations.map(async (item) => {
          const operation = await OperationController.formatOperation(
            item,
            currency
          );
          return operation;
        })
      );

      let totalOperationsValue = 0;
      operationsFormatted.forEach((i) => {
        totalOperationsValue += i.totalValue;
      });

      return {
        operationsFormatted,
        totalOperationsValue,
      };
    } catch (err) {
      throw err;
    }
  };
}

module.exports = UserController;
