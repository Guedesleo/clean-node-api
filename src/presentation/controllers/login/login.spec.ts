import { LoginController } from "./login";
import { badRequest } from "../../helpers/http-helper";
import { MissingParmError } from "../../errors";

describe("Login Controller", () => {
  test("Should return 400 if no email is provider", async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpReposne = await sut.handle(httpRequest);
    expect(httpReposne).toEqual(badRequest(new MissingParmError("email")));
  });
});
