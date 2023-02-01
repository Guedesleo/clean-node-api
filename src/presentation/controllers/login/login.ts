import { InvalidParmError, MissingParmError } from "../../errors";
import {
  badRequest,
  serverError,
  unauthorized,
  ok,
} from "../../helpers/http/http-helper";
import {
  Controller,
  HttpReponse,
  HttRequest,
  Authentication,
  Validation,
} from "./login-protocols";
export class LoginController implements Controller {
  private readonly authentication: Authentication;
  private readonly validation: Validation;

  constructor(authentication: Authentication, validation: Validation) {
    this.authentication = authentication;
    this.validation = validation;
  }
  async handle(httpRequest: HttRequest): Promise<HttpReponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }
      const { email, password } = httpRequest.body;

      const accessToken = await this.authentication.auth(email, password);

      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
