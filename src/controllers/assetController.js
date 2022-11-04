const { use } = require("passport");
const FinancialApi = require("../api/financial");
const ApplicationError = require("../errors/ApplicationError");
const Asset = require("../models/Asset");
const ExtractController = require("./extractController");
const UserController = require("./UserController");

class AssetController {
  constructor(user) {
    this.user = user;
  }

  static searchCompanyByName = async (name) => {
    try {
      const companyList = await FinancialApi.findByName(name);
      return companyList;
    } catch (err) {
      throw err;
    }
  };

  static getCurrentValueBySymbol = async (symbol) => {
    try {
      const value = await FinancialApi.findBySymbol(symbol);
      return value;
    } catch (err) {
      throw err;
    }
  };

  static getHistoricalValues = async (days) => {
    try {
      return await FinancialApi.getHistorialValues(days);
    } catch (err) {
      throw err;
    }
  };

  static findAssetById = async (id) => {
    try {
      const asset = await Asset.findById(id);
      return asset;
    } catch (err) {
      throw err;
    }
  };

  getAllAssetsOfUser = async () => {
    try {
      const assetsList = (await this.user.populate("assets")).assets;
      const formattedAssets = await assetsList.map(async (asset) => {
        const currentValue = await AssetController.getCurrentValueBySymbol(
          asset.symbol
        );
        return {
          currentValue,
          symbol: asset.symbol,
          stockValueAverage: asset.stockValueAverage,
          totalValue: asset.totalValue,
          quantity: asset.quantity,
        };
      });
      return Promise.all(formattedAssets);
    } catch (err) {
      throw err;
    }
  };

  findUserAssetBySymbol = async (symbol) => {
    try {
      const asset = await Asset.findOne({ symbol });
      return asset;
    } catch (err) {
      throw err;
    }
  };

  createAsset = async ({ symbol, quantity, stockValue }) => {
    try {
      const asset = new Asset({
        symbol,
        stockValueAverage: stockValue,
        totalValue: stockValue * quantity,
        quantity,
        user: this.user,
      });
      return asset;
    } catch (err) {
      throw err;
    }
  };

  updateAsset = async (asset, operationData) => {
    try {
      const { totalValue } = asset;
      const { stockValue } = operationData;
      const performTotalValue = Math.abs(operationData.quantity) * stockValue;
      const newQuantity = asset.quantity + operationData.quantity;
      const newTotalValue = totalValue + performTotalValue;
      const newStockValueAverage = newTotalValue / newQuantity;

      if (newQuantity < 0) {
        throw new ApplicationError("Insufficient Assets in Wallet", 403);
      }

      asset.quantity = newQuantity;
      asset.totalValue = newTotalValue;
      asset.stockValueAverage = newStockValueAverage;

      return asset;
    } catch (err) {
      throw err;
    }
  };

  deleteAsset = async (assetId) => {
    try {
      return await Asset.deleteOne({ _id: assetId });
    } catch (err) {
      throw err;
    }
  };

  buyAsset = async (symbol, quantity) => {
    try {
      const stockValue = await FinancialApi.findBySymbol(symbol);
      const asset = await this.findUserAssetBySymbol(symbol);
      const operationValue = quantity * stockValue;
      const user = await UserController.withdrawFunds(
        this.user._id,
        operationValue
      );
      if (!asset) {
        const newAsset = await this.createAsset({
          symbol,
          quantity,
          stockValue,
        });
        await newAsset.save();
        this.user.assets.push(newAsset);
        await this.user.save();
      } else {
        const updatedAsset = await this.updateAsset(asset, {
          quantity,
          stockValue,
        });
        await updatedAsset.save();
      }

      const extractController = new ExtractController(user);
      const extract = await extractController.createExtract(
        operationValue,
        "buyAsset"
      );

      user.extracts.push(extract);
      return await user.save();
    } catch (err) {
      throw err;
    }
  };

  sellAsset = async (symbol, quantity) => {
    try {
      const stockValue = await FinancialApi.findBySymbol(symbol);
      let asset = await this.findUserAssetBySymbol(symbol);
      if (!asset) {
        throw new ApplicationError("Asset not available in the Wallet", 404);
      }
      asset = await this.updateAsset(asset, {
        quantity: -quantity,
        stockValue: -stockValue,
      });
      if (asset.quantity == 0) {
        await this.deleteAsset(asset._id);
      }
      else {
        await asset.save();
      }

      const operationValue = quantity * stockValue;
      const user = await UserController.addFunds(this.user._id, operationValue);

      const extractController = new ExtractController(user);
      const extract = await extractController.createExtract(
        operationValue,
        "sellAsset"
      );

      user.extracts.push(extract);
      return await user.save();
    } catch (err) {
      throw err;
    }
  };

}

module.exports = AssetController;
