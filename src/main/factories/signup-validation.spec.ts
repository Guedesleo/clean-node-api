import { CompareFieldsValidation } from "../../presentation/helpers/validators/compera-fields-validation copy";
import { RequiredFieldValidation } from "../../presentation/helpers/validators/required-field-validation";
import { Validation } from "../../presentation/helpers/validators/validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";
import { makeSignUpValidation } from "./signup-validation";

jest.mock("../../presentation/helpers/validators/validation-composite");

describe("SignUpValidaitonFacotry", () => {
  test("Should call ValidaitonComposite wiht all validations", () => {
    makeSignUpValidation();

    const validations: Validation[] = [];

    for (const field of ["name", "email", "password", "passwordConfirmation"]) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(
      new CompareFieldsValidation("password", "passwordConfirmation")
    );

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
