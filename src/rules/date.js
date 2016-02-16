import {ValidationRule} from '../validation-rule';

export class DateRule {
  constructor() {
    return new ValidationRule('date', true);
  }
}
