import {ValidationRule} from '../validation-rule';

export class RequiredRule {
  constructor() {
    return new ValidationRule('presence', true);
  }
}
