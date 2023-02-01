import { MissingParmError } from "../../errors";
import { Validation } from "../../protocols/validation";
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
  validationStubs: Validation[];
};

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidaiton(), makeValidaiton()];
  const sut = new ValidationComposite(validationStubs);
  return {
    sut,
    validationStubs,
  };
};

describe("Validation Composite", () => {
  test("Should return an error if any validation fails", () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParmError("field"));
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParmError("field"));
  });

  test("Should return the first error if more then one validation fails", () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], "validate")
      .mockReturnValueOnce(new MissingParmError("field"));
    const error = sut.validate({ field: "any_error" });
    expect(error).toEqual(new Error());
  });

  test("Should not return if validation succeeds", () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: "any_value" });
    expect(error).toBeFalsy();
  });
});
