const axios = require("axios");
const ApplicationError = require("../errors/ApplicationError");
require("dotenv").config();

const apiKey = process.env.FINANCIAL_API_KEY;

class FinancialApi {
  static findBySymbol = async (symbol) => {
    try {
      const apiRequest = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`
      );
      const data = apiRequest.data;
      if (!(data.length > 0)) {
        throw new ApplicationError("The symbol is not available", 404);
      } else {
        return data[0].price;
      }
    } catch (err) {
      if (err.code === "ENOTFOUND") {
        throw new ApplicationError("The host is not found", 503);
      } else {
        throw err;
      }
    }
  };

  static getHistorialValues = async (days, symbol) => {
    try {
      const apiRequest = await axios.get(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=${days}&apikey=${apiKey}`
      )
      const data = apiRequest.data.historical;
      if (!(data.length > 0)) {
        throw new ApplicationError("Results not found", 404);
      }
      const valueList = data.map((i) => {
        return {
          date: i.date,
          value: i.close,
        };
      });
      return valueList;
    } catch (err) {
      if (err.code === "ENOTFOUND") {
        throw new ApplicationError("The host is not found", 503);
      } else {
        throw err;
      }
    }
  };

  static findByName = async (name) => {
    try {
      const apiRequest = await axios.get(
        `https://financialmodelingprep.com/api/v3/search-name?query=${name}&apikey=${apiKey}`
      );
      const data = apiRequest.data;
      if (!(data.length > 0)) {
        throw new ApplicationError("Results not found", 404);
      } else {
        const companyList = data.map((i) => {
          return {
            name: i.name,
            symbol: i.symbol,
            exchangeCompany: i.stockExchange,
          };
        });
        return companyList;
      }
    } catch (err) {
      if (err.code === "ENOTFOUND") {
        throw new ApplicationError("The host is not found", 503);
      } else {
        throw err;
      }
    }
  };
}

module.exports = FinancialApi;
