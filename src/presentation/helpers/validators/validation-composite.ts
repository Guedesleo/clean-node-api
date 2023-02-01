import { Validation } from "../../protocols/validation";

export class ValidationComposite implements Validation {
  private readonly validaitons: Validation[];
  constructor(validaitons: Validation[]) {
    this.validaitons = validaitons;
  }
  validate(input: any): Error {
    for (const validation of this.validaitons) {
      const error = validation.validate(input);
      if (error) {
        return error;
      }
    }
  }
}
