import {ValidationReporter} from './validation-reporter';

export class ValidationEngine {
  static getValidationReporter(instance) {
    return instance.__validationReporter__ || (instance.__validationReporter__ = new ValidationReporter());
  }
}
