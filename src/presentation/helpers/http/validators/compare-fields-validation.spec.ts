import { CompareFieldsValidation } from "./compare-fields-validation";
import { InvalidParmError } from "../../../errors";

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation("field", "fieldToCompare");
};

describe("CompareFieldsValidation", () => {
  test("Should return an InvalidParamError if validation fails", () => {
    const sut = makeSut();
    const error = sut.validate({
      field: "any_field",
      fieldToCompare: "other_field",
    });
    expect(error).toEqual(new InvalidParmError("fieldToCompare"));
  });

  test("Should not return if validation succeeds", () => {
    const sut = makeSut();
    const error = sut.validate({
      field: "any_value",
      fieldToCompare: "any_value",
    });
    expect(error).toBeFalsy();
  });
});
