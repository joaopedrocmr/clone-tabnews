export class InternalServerError extends Error {
  constructor({ cause }) {
    super("An unexpected error has occurred", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Please try again later.";
    this.statusCode = 500;
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
