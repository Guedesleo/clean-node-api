import { MissingParmError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { Controller, HttpReponse, HttRequest } from "../../protocols";
import { EmailValidator } from "../signup/signup-protocols";
export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  async handle(httpRequest: HttRequest): Promise<HttpReponse> {
    if (!httpRequest.body.email) {
      return new Promise((resolve) =>
        resolve(badRequest(new MissingParmError("email")))
      );
    }

    if (!httpRequest.body.password) {
      return new Promise((resolve) =>
        resolve(badRequest(new MissingParmError("password")))
      );
    }

    this.emailValidator.isValid(httpRequest.body.email);
  }
}
