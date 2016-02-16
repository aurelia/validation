import {ValidationRule} from '../validation-rule';

export class UrlRule {
  constructor() {
    return new ValidationRule('url', true);
  }
}
