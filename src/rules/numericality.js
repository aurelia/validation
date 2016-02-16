import {ValidationRule} from '../validation-rule';

export class NumericalityRule {
  constructor(config) {
    return new ValidationRule('numericality', config);
  }
}
