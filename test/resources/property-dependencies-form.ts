import { inject } from 'aurelia-dependency-injection';
import { inlineView } from 'aurelia-templating';
import {
  ValidationRules,
  ValidationControllerFactory,
  ValidationController,
  validateTrigger
} from '../../src/aurelia-validation';

@inlineView(`
<template>
  <form novalidate autocomplete="off" if.bind="showForm">
    <input        id="firstName" type="text" value.bind="firstName & validate">
    <input        id="lastName"  type="text" value.bind="lastName & validate">
    <input        id="email"     type="text" value.bind="email & validate">
    <input        id="number1"   type="text" number-value.bind="number1 & validate"> 
    <number-input id="number2"               value.bind="number2 & validate"></number-input>
    <input        id="password"        type="text" value.bind="password & validate">
    <input        id="confirmPassword" type="text" value.bind="confirmPassword & validate">
  </form>
</template>`)
@inject(ValidationControllerFactory)
export class PropertyDependenciesForm {
  public firstName = '';
  public lastName = '';
  public email = '';
  public number1: number = 0;
  public number2: number = 0;
  public password = '';
  public confirmPassword = '';
  public controller: ValidationController;
  public showForm = true;

  constructor(controllerFactory: ValidationControllerFactory) {
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.validateTrigger = validateTrigger.change;

  }
}

ValidationRules.customRule(
  'matchesProperty',
  (value, obj, otherPropertyName) =>
    value === null
    || value === undefined
    || value === ''
    || obj[otherPropertyName] === null
    || obj[otherPropertyName] === undefined
    || obj[otherPropertyName] === ''
    || value === obj[otherPropertyName],
  '${$displayName} must match ${$getDisplayName($config.otherPropertyName)}',
  otherPropertyName => ({ otherPropertyName })
);

ValidationRules
  .ensure((f: PropertyDependenciesForm) => f.password)
    .required()
    .satisfiesCondition({
                          ruleName: 'matchesProperty',
                          args: ['confirmPassword']
                        })
  .ensure((f: PropertyDependenciesForm) => f.confirmPassword)
    .required()
    .satisfiesCondition({
                          ruleName: 'matchesProperty',
                          args: ['password']
                        })

  .ensureObject()
    .satisfiesCondition({
      condition: (f: PropertyDependenciesForm) => {
                                          return (f.number1 === null ||
                                                  f.number1 === undefined ||
                                                  f.number2 === null ||
                                                  f.number2 === undefined
                                          || (f.number1 === 1 && f.number2 === 2));
                                        }
    })
    .tag('numberMatch')
    .withMessage('numbers must be equal to 1 and 2')

  .ensure(f => f.number1)
    .satisfiesCondition({
      tags: ['numberMatch']
    })
    // .withMessage('numbers must be equal to 1 and 2')

  .ensure(f => f.number2)
    .satisfiesCondition({
      tags: ['numberMatch']
    })
    // .withMessage('numbers must be equal to 1 and 2')

  .on(PropertyDependenciesForm);
