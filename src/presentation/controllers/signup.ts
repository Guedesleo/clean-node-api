import { HttRequest, HttpReponse } from "../protocols/http";
import { MissingParmError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helper";
export class SignUpController {
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
