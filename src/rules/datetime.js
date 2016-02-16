import {ValidationRule} from '../validation-rule';

export class DatetimeRule {
  constructor() {
    return new ValidationRule('datetime', true);
  }
}
