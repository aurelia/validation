import { ValidationReporter } from './validation-reporter';

export let ValidationEngine = class ValidationEngine {
  static getValidationReporter(instance) {
    return instance.__validationReporter__ || (instance.__validationReporter__ = new ValidationReporter());
  }
};