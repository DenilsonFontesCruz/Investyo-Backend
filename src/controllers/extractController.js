const Extract = require("../models/Extract");

class ExtractController {
  constructor(user) {
    this.user = user;
  }

  getAllExtractsOfUser = async () => {
    try {
      const extractsList = (await this.user.populate("extracts")).extracts;
      const formattedExtracts = await extractsList.map(async (extract) => {
        return {
          issueDate: extract.issueDate,
          value: extract.value,
          type: extract.type,
        };
      });
      return Promise.all(formattedExtracts);
    } catch (err) {
      throw err;
    }
  };

  createExtract = async (value, type) => {
    try {
      const issueDate = Date.now();
      const extractValue = Math.abs(value);
      const extract = new Extract({
        issueDate,
        value: extractValue,
        type,
        user: this.user._id,
      });
      await extract.save();
      return extract;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = ExtractController;