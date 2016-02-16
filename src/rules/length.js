import {ValidationRule} from '../validation-rule';

export class LengthRule {
  constructor(config) {
    return new ValidationRule('length', config);
  }
}
