import {inject} from 'aurelia-dependency-injection';
import {
  ValidationRules,
  ValidationControllerFactory,
  ValidationController
} from '../../src/aurelia-validation';

@inject(ValidationControllerFactory)
export class RegistrationForm {
  firstName = '';
  lastName = '';
  email = '';
  controller: ValidationController;
  showForm = true;

  constructor(controllerFactory: ValidationControllerFactory) {
    this.controller = controllerFactory.createForCurrentScope();
  }
}

ValidationRules
  .ensure('firstName').required()
  .ensure('lastName').required()
  .ensure('email').required().email()
  .on(RegistrationForm);
