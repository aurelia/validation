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
    <input        id="firstName" type="text" value.bind="firstName & validate">
    <input        id="lastName"  type="text" value.bind="lastName & validate">
    <input        id="email"     type="text" value.bind="email & validate">
    <input        id="number1"   type="text" number-value.bind="number1 & validate"> 
    <number-input id="number2"               value.bind="number2 & validate"></number-input> 
  </form>
</template>`)
@inject(ValidationControllerFactory)
export class RegistrationForm {
  firstName = '';
  lastName = '';
  email = '';
  number1 = 0;
  number2 = 0;
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
  .ensure(f => f.number1).satisfies(value => value > 0)
  .ensure(f => f.number2).satisfies(value => value > 0)
  .on(RegistrationForm);
