import {
  Controller,
  HttpReponse,
  HttRequest,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./Log";
import { serverError } from "../../presentation/helpers/http-helper";
import { LogErrorRepository } from "../../data/protocols/log-error-repository";

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}
const makeLogErrorRepository = (): LogErrorRepository => {
  class logErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new logErrorRepositoryStub();
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttRequest): Promise<HttpReponse> {
      const httpResponse: HttpReponse = {
        statusCode: 200,
        body: {
          name: "Leoanrdo",
        },
      };
      return new Promise((resolve) => resolve(httpResponse));
    }
  }
  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe("LogController Decorator", () => {
  test("Should call controller handle", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        passowrd: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test("Should return the same result of the controller", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        passowrd: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpReponse = await sut.handle(httpRequest);
    expect(httpReponse).toEqual({
      statusCode: 200,
      body: {
        name: "Leoanrdo",
      },
    });
  });

  test("Should call LogErrorRepository with correct error if controller return a server error ", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = "any_stack";
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorRepositoryStub, "log");
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(new Promise((resolve) => resolve(error)));
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        name: "any_name",
        passowrd: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenLastCalledWith("any_stack");
  });
});
