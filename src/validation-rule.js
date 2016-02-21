import validate from 'validate.js';
import {ValidationError} from './validation-error';

export class ValidationRule {
  name = '';
  config;
  constructor(name, config) {
    this.name = name;
    this.config = config;
  }
  validate(target, propName) {
    if (target && propName) {
      let validator = { [propName]: { [this.name]: this.config } };
      let result = validate(target, validator);
      return new ValidationError(result);
    }
    throw new Error('Invalid target or property name.');
  }
}
