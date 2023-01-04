import {
  HttRequest,
  HttpReponse,
  Controller,
  EmailValidator,
} from "../protocols";
import { badRequest, serverError } from "../helpers/http-helper";
import { MissingParmError, InvalidParmError } from "../errors";
import { AddAccount } from "../../domain/usecases/add-account";
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
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

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParmError("passwordConfirmation"));
      }

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) return badRequest(new InvalidParmError("email"));

      this.addAccount.add({ name, email, password });
    } catch (error) {
      return serverError();
    }
  }
}
