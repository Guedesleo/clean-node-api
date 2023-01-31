import { InvalidParmError, MissingParmError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { Controller, HttpReponse, HttRequest } from "../../protocols";
import { EmailValidator } from "../signup/signup-protocols";
export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  async handle(httpRequest: HttRequest): Promise<HttpReponse> {
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
  }
}
