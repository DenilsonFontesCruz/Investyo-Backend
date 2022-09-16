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
        const filteredData = {
          name: data[0].name,
          stockValue: data[0].price,
          symbol: data[0].symbol,
          category: data[0].exchange,
        };
        return filteredData;
      }
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
        const filteredData = data.map((i) => {
          return {
            name: i.name,
            symbol: i.symbol,
            category: i.stockExchange
          };
        });
        return filteredData;
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
