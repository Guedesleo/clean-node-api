import {
  Controller,
  HttpReponse,
  HttRequest,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./Log";
import { serverError } from "../../presentation/helpers/http-helper";
import { LogErrorRepository } from "../../data/protocols/log-error-repository";

const makeFakeRequest = (): HttRequest => ({
  body: {
    name: "any_name",
    email: "any_email@email.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

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
    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test("Should return the same result of the controller", async () => {
    const { sut } = makeSut();
    const httpReponse = await sut.handle(makeFakeRequest());
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
    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenLastCalledWith("any_stack");
  });
});
