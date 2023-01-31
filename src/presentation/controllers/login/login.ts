import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParmError, MissingParmError } from "../../errors";
import { badRequest, serverError } from "../../helpers/http-helper";
import { Controller, HttpReponse, HttRequest } from "../../protocols";
import { EmailValidator } from "../signup/signup-protocols";
export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly authentication: Authentication;
  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }
  async handle(httpRequest: HttRequest): Promise<HttpReponse> {
    try {
      const { email, password } = httpRequest.body;

      if (!email) {
        return new Promise((resolve) =>
          resolve(badRequest(new MissingParmError("email")))
        );
      }

      if (!password) {
        return new Promise((resolve) =>
          resolve(badRequest(new MissingParmError("password")))
        );
      }

      const isValid = await this.emailValidator.isValid(email);

      if (!isValid) {
        return new Promise((resolve) =>
          resolve(badRequest(new InvalidParmError("email")))
        );
      }

      await this.authentication.auth(email, password);
    } catch (error) {
      return serverError(error);
    }
  }
}
