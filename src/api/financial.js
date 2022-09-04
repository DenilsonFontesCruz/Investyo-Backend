const axios = require("axios");
const ApplicationError = require("../errors/ApplicationError");

class FinancialApi {
  static findBySymbol = async (symbol) => {

    try {
      const apiRequest = await axios(
        `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=04e2b0d3538233ced4df24eeb4365247`
      );
      const data = apiRequest.data;
      if (!(data.length > 0)) {
        return new ApplicationError(
          "The symbol is not available",
          404
        );
      } else {
        const filteredData = {
          name: data[0].name,
          price: data[0].price,
          symbol: data[0].symbol
        }
        return filteredData;
      }
    } catch (error) {
      if (error.code === "ENOTFOUND") {
        return new ApplicationError("The host is not found", 503);
      } else {
        console.error(error);
      }
    }
  };

}

module.exports = FinancialApi;
