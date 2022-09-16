const axios = require("axios");
const ApplicationError = require("../errors/ApplicationError");
require("dotenv").config();

const apiKey = process.env.EXCHANGE_API_KEY;

class ExchangeApi {
  static convertCurrency = async (currency) => {
    try {
      const apiRequest = await axios.get(
        `https://api.apilayer.com/exchangerates_data/convert?to=${currency}&from=USD&amount=1`,
        {
          headers: {
            apikey: apiKey,
          },
        }
      );

      const ratioValue = apiRequest.data.result;

      return ratioValue;
    } catch (err) {
      if (err.code === "ENOTFOUND") {
        throw new ApplicationError("The host is not found", 503);
      } else {
        throw err;
      }
    }
  };
}

module.exports = ExchangeApi;
