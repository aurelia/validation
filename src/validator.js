import {ValidationError} from './validation-error';

export class Validator {
  validateProperty(object, propertyName, rules = null): ValidationError[] {
    throw new Error('A Validator must implement validateProperty');
  }

  validateObject(object, rules = null): ValidationError[] {
    throw new Error('A Validator must implement validateObject');
  }
}
