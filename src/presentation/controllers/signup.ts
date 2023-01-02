import { HttRequest, HttpReponse } from "../protocols/http";
import { MissingParmError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";
export class SignUpController implements Controller {
  handle(httpRequest: HttRequest): HttpReponse {
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
  }
}
