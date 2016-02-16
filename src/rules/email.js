import {ValidationRule} from '../validation-rule';

export class EmailRule {
  constructor() {
    return new ValidationRule('email', true);
  }
}
