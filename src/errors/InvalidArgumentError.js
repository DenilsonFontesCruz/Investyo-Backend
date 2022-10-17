class InvalidArgumentError extends Error {
  constructor() {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = "Invalid Arguments.";

    this.status = 403;
  }
}

module.exports = InvalidArgumentError;