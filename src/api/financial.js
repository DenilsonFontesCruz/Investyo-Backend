const axios = require("axios");
const ApplicationError = require("../errors/ApplicationError");

class financialApi {
  static getStocks = async (req, res, next) => {
    const cod = req.query.cod;

    try {
      const apiRequest = await axios(
        `https://financialmodelingprep.com/api/v3/quote/${cod}?apikey=04e2b0d3538233ced4df24eeb4365247`
      );
      const data = apiRequest.data;
      if (!(data.length > 0)) {
        next(new ApplicationError(
          "The symbol is not available",
          404
        ));
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
        next(new ApplicationError("The host is not found", 503));
      } else {
        console.error(error);
      }
    }
  };
}

module.exports = financialApi;
