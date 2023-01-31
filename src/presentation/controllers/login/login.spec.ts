import { LoginController } from "./login";
import { badRequest } from "../../helpers/http-helper";
import { MissingParmError } from "../../errors";

interface SutTypes {
  sut: LoginController;
}

const makeSut = (): SutTypes => {
  const sut = new LoginController();

  return {
    sut,
  };
};

describe("Login Controller", () => {
  test("Should return 400 if no email is provider", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_password",
      },
    };
    const httpReposne = await sut.handle(httpRequest);
    expect(httpReposne).toEqual(badRequest(new MissingParmError("email")));
  });

  test("Should return 400 if no password is provider", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com  ",
      },
    };
    const httpReposne = await sut.handle(httpRequest);
    expect(httpReposne).toEqual(badRequest(new MissingParmError("password")));
  });
});
