export class InvalidParmError extends Error {
  constructor(paramName: string) {
    super(`Invalid param: ${paramName}`);
    this.name = "InvalidParamError";
  }
}
