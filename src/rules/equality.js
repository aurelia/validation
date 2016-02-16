import {ValidationRule} from '../validation-rule';

export class EqualityRule {
  constructor() {
    return new ValidationRule('equality', true);
  }
}
