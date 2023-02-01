import { MissingParmError } from "../../errors";
import { Validation } from "./validation";
import { ValidationComposite } from "./validation-composite";

const makeValidaiton = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

type SutTypes = {
  sut: ValidationComposite;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidaiton();
  const sut = new ValidationComposite([validationStub]);
  return {
    sut,
    validationStub,
  };
};

describe("Validation Composite", () => {
  test("Should return an error if any validation fails", () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParmError("field"));
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParmError("field"));
  });
});
