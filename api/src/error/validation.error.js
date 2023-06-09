module.exports = function ValidationError(message = "Validation Error") {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
  };
  
  require('util').inherits(module.exports, Error);