export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("An unexpected error has occurred", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Please try again later.";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Service error occurred", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "The requested service is unavailable.";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor({ cause }) {
    super("An unexpected error has occurred", {
      cause,
    });
    this.name = "MethodNotAllowedError";
    this.action = "The requested HTTP method is not allowed for this endpoint.";
    this.statusCode = 405;
    this.message = "Method not allowed";
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status: this.statusCode,
    };
  }
}
