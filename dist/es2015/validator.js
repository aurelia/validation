import { ValidationError } from './validation-error';

export let Validator = class Validator {
  validateProperty(object, propertyName, rules = null) {
    throw new Error('A Validator must implement validateProperty');
  }

  validateObject(object, rules = null) {
    throw new Error('A Validator must implement validateObject');
  }
};