class APIError extends Error {
  constructor(message, status, details = {}) {
    super(message);
    this.code = 'APIError';
    this.status = status;
    this.details = details;
  }
}


class ValidationError extends APIError {
  constructor(message, details) {
    super (message, 400, details)
    this.code = "ValidationError";
  }
}

module.exports.ValidationError = ValidationError