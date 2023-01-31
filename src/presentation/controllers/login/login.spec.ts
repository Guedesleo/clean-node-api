import { LoginController } from "./login";
import { badRequest } from "../../helpers/http-helper";
import { InvalidParmError, MissingParmError } from "../../errors";
import { EmailValidator, HttRequest } from "../signup/signup-protocols";

const makeEmailValidor = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeFakeRequest = (): HttRequest => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password",
  },
});

interface SutTypes {
  sut: LoginController;
  emailValidadeStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidadeStub = makeEmailValidor();
  const sut = new LoginController(emailValidadeStub);

  return {
    sut,
    emailValidadeStub,
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
        email: "any_email@mail.com",
      },
    };
    const httpReposne = await sut.handle(httpRequest);
    expect(httpReposne).toEqual(badRequest(new MissingParmError("password")));
  });

  test("Should return 400 if an invalid email is provider", async () => {
    const { sut, emailValidadeStub } = makeSut();

    jest.spyOn(emailValidadeStub, "isValid").mockReturnValueOnce(false);
    const httpReposne = await sut.handle(makeFakeRequest());
    expect(httpReposne).toEqual(badRequest(new InvalidParmError("email")));
  });

  test("Should call EmailValidor with correct email", async () => {
    const { sut, emailValidadeStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidadeStub, "isValid");
    await sut.handle(makeFakeRequest());
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
