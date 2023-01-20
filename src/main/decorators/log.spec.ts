import {
  Controller,
  HttpReponse,
  HttRequest,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./Log";

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}
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
  const sut = new LogControllerDecorator(controllerStub);

  return {
    sut,
    controllerStub,
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
});
