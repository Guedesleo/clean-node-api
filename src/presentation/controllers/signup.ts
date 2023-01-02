import { HttRequest, HttpReponse } from "../protocols/http";

import { MissingParmError } from "../errors/missing-param-error";
export class SignUpController {
  handle(httpRequest: HttRequest): HttpReponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParmError("name"),
      };
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParmError("email"),
      };
    }
  }
}
