export class UnauthorizeError extends Error {
  constructor() {
    super(`Unauthorized`);
    this.name = "UnauthorizedError";
  }
}
