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

      await this.authentication.auth(email, password);
    } catch (error) {
      return serverError(error);
    }
  }
}
