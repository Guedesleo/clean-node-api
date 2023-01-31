import { InvalidParmError, MissingParmError } from "../../errors";
import {
  badRequest,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import {
  Controller,
  HttpReponse,
  HttRequest,
  EmailValidator,
  Authentication,
} from "./login-protocols";
export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly authentication: Authentication;
  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }
  async handle(httpRequest: HttRequest): Promise<HttpReponse> {
    try {
      const requiredFields = ["email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParmError(field));
        }
      }

      const { email, password } = httpRequest.body;
      const isValid = await this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParmError("email"));
      }

      const accesToken = await this.authentication.auth(email, password);

      if (!accesToken) {
        return unauthorized();
      }
    } catch (error) {
      return serverError(error);
    }
  }
}
