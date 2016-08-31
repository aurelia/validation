import {inject} from 'aurelia-dependency-injection';
import {inlineView} from 'aurelia-templating';
import {
  ValidationRules,
  ValidationControllerFactory,
  ValidationController
} from '../../src/aurelia-validation';

@inlineView(`
<template>
  <form novalidate autocomplete="off" if.bind="showForm">
    <ul><li repeat.for="error of controller.errors">\${error.message}</li></ul>
    <input id="firstName" type="text" value.bind="firstName & validate">
    <input id="lastName"  type="text" value.bind="lastName & validate">
    <input id="email"     type="text" value.bind="email & validate">
  </form>
</template>`)
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
  .ensure((f: RegistrationForm) => f.firstName).required()
  .ensure(f => f.lastName).required()
  .ensure('email').required().email()
  .on(RegistrationForm);
