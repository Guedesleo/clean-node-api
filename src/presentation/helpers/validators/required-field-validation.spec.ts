import { RequiredFieldValidation } from "./required-field-validation";
import { MissingParmError } from "../../errors";

describe("RequiredField Validation", () => {
  test("Should return a MissingParamError if validation fails", () => {
    const sut = new RequiredFieldValidation("field");
    const error = sut.validate({ name: "any_name" });
    expect(error).toEqual(new MissingParmError("field"));
  });
});
