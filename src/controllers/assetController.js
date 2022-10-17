const FinancialApi = require("../api/financial");
const ApplicationError = require("../errors/ApplicationError");
const Asset = require("../models/Asset");

class AssetController {
  constructor(user) {
    this.user = user;
  }

  static searchCompanyByName = async (name) => {
    try {
      const companyList = await FinancialApi.findByName(name);
      return result;
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
        totalValue: stockValue,
        quantity,
        user: this.user,
      });
      await asset.save();
      return asset;
    } catch (err) {
      throw err;
    }
  };

  updateAsset = async (asset, { performQuantity, stockValue }) => {
    try {
      const { totalValue, quantity } = asset;
      const performTotalValue = Math.abs(performQuantity) * stockValue;
      const newQuantity = quantity + performQuantity;
      const newTotalValue = totalValue + performTotalValue;
      const newStockValueAverage = newTotalValue / newQuantity;

      asset.quantity = newQuantity;
      asset.totalValue = newTotalValue;
      asset.stockValueAverage = newStockValueAverage;

      await asset.save();
      return asset;
    } catch (err) {
      throw err;
    }
  };

  buyAsset = async (symbol, quantity) => {
    try {
      const stockValue = await FinancialApi.findBySymbol(symbol);
      let asset = await this.findUserAssetBySymbol(symbol);
      if (!asset) {
        asset = await this.createAsset({
          symbol,
          quantity,
          stockValue,
        });
      } else {
        asset = await this.updateAsset(asset, { performQuantity: quantity, stockValue });
      }
      this.user.assets.push(asset);
      await this.user.save();
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
        performQuantity: -quantity,
        stockValue: -stockValue,
      });

      this.user.assets.push(asset);
      await this.user.save();
    } catch (err) {
      throw err;
    }
  };
}

module.exports = AssetController;
