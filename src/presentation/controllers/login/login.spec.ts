import { LoginController } from "./login";
import {
  badRequest,
  serverError,
  unauthorized,
} from "../../helpers/http-helper";
import { InvalidParmError, MissingParmError } from "../../errors";
import { EmailValidator, HttRequest, Authentication } from "./login-protocols";
const makeEmailValidor = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }

  return new AuthenticationStub();
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
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const emailValidadeStub = makeEmailValidor();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidadeStub, authenticationStub);

  return {
    sut,
    emailValidadeStub,
    authenticationStub,
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

  test("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidadeStub } = makeSut();
    jest.spyOn(emailValidadeStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should call Authenticaiton with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    await sut.handle(makeFakeRequest());
    expect(authSpy).toHaveBeenCalledWith("any_email@mail.com", "any_password");
  });

  test("Should return 401 if  invalid credenditals is provider", async () => {
    const { sut, authenticationStub } = makeSut();

    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(unauthorized());
  });
});
