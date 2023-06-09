module.exports = function BadRequestError(message = "Can't process request.") {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
  };
  require('util').inherits(module.exports, Error);