import { HttRequest, HttpReponse } from "../protocols/http";
import { MissingParmError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/http-helper";
export class SignUpController {
  handle(httpRequest: HttRequest): HttpReponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParmError("name"));
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParmError("email"));
    }
  }
}
