import {
  HttRequest,
  HttpReponse,
  Controller,
  EmailValidator,
} from "../protocols";
import { badRequest, serverError } from "../helpers/http-helper";
import { MissingParmError, InvalidParmError } from "../errors";
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttRequest): HttpReponse {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParmError(field));
        }
      }

      const { email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParmError("passwordConfirmation"));
      }

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) return badRequest(new InvalidParmError("email"));
    } catch (error) {
      return serverError();
    }
  }
}
