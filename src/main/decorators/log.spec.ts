import {
  Controller,
  HttpReponse,
  HttRequest,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./Log";
import { serverError, ok } from "../../presentation/helpers/http-helper";
import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { AccountModel } from "../../domain/models/account";

const makeFakeRequest = (): HttRequest => ({
  body: {
    name: "any_name",
    email: "any_email@email.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password",
});

const makeFakeServerError = (): HttpReponse => {
  const fakeError = new Error();
  fakeError.stack = "any_stack";
  return serverError(fakeError);
};

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}
const makeLogErrorRepository = (): LogErrorRepository => {
  class logErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new logErrorRepositoryStub();
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttRequest): Promise<HttpReponse> {
      return new Promise((resolve) => resolve(ok(makeFakeAccount())));
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
    expect(httpReponse).toEqual(ok(makeFakeAccount()));
  });

  test("Should call LogErrorRepository with correct error if controller return a server error ", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, "logError");
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(makeFakeServerError()))
      );
    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenLastCalledWith("any_stack");
  });
});
