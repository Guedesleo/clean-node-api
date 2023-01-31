import { MissingParmError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { Controller, HttpReponse, HttRequest } from "../../protocols";
export class LoginController implements Controller {
  async handle(httpRequest: HttRequest): Promise<HttpReponse> {
    if (!httpRequest.body.email) {
      return new Promise((resolve) =>
        resolve(badRequest(new MissingParmError("email")))
      );
    }
    return new Promise((resolve) =>
      resolve(badRequest(new MissingParmError("password")))
    );
  }
}
