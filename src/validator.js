import {ValidationError} from './validation-error';

export class Validator {
  validateProperty(object, propertyName, rules = null): ValidationErrors[] {
    throw new Error('A Validator must implement validateProperty');
  }

  validateObject(object, rules = null): ValidationErrors[] {
    throw new Error('A Validator must implement validateObject');
  }
}
