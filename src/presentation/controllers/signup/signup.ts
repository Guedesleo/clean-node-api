import {
  HttRequest,
  HttpReponse,
  Controller,
  EmailValidator,
  AddAccount,
  Validation,
} from "./signup-protocols";
import { badRequest, serverError, ok } from "../../helpers/http-helper";
import { MissingParmError, InvalidParmError } from "../../errors";
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  private readonly validation: Validation;

  constructor(
    emailValidator: EmailValidator,
    addAccount: AddAccount,
    validation: Validation
  ) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
    this.validation = validation;
  }

  async handle(httpRequest: HttRequest): Promise<HttpReponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }
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

      const account = await this.addAccount.add({ name, email, password });

      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
