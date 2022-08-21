const axios = require("axios");
const BasicError = require("../errors/BasicError.js");
const path = "./src/api/financial.js";

class financialApi {
  static getStocks = async (req, res) => {
    const cod = req.query.cod;

    try {
      const apiRequest = await axios(
        `https://financialmodelingprep.com/api/v3/quote/${cod}?apikey=04e2b0d3538233ced4df24eeb4365247`
      );
      const data = apiRequest.data;
      if (!(data.length > 0)) {
        const basicError = new BasicError(
          "The symbol is not available",
          404,
          path
        );
        basicError.sendResponse(res);
      } else {
        const filteredData = {
          name: data[0].name,
          price: data[0].price,
          symbol: data[0].symbol
        }
        res.status(200).send(filteredData);
      }
    } catch (error) {
      if (error.code === "ENOTFOUND") {
        const basicError = new BasicError("The host is not found", 503, path);
        basicError.sendResponse(res);
      } else {
        console.error(error);
      }
    }
  };
}

module.exports = financialApi;
