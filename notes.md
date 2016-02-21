Scenarios to cover

1. Called on property change - opt in?
2. Called explicitly (submitting a form for validation, or explicitly calling a validate function on a config (serverside for instance))
3. Client-side only scenario

TODOS

0. Add Jeremy as contributor to all repos
1. Create the validation-error class - Patrick
3. Create the Validator interface - Patrick
4. Create reporter interface - Patrick, but done
5. Move current reporter to validatejs repo - Patrick
6. Create validation observer for validatejs - Jeremy
7. Get the BootstrapFormGroupRenderer on templating-validation - Jeremy, might be later
8. Implement interfaces for breeze library - Jeremy


1. Run validation on an object
1. Run validation on an objects property
1. Observing property changes for validation
aurelia-validation
  Validator { Validate(object), Validate(objec, prop) GetPRops? }
  ValidationError { obj, property?, message, }
  Reporter { add(object) remove(object) subsribe, unbsubscribe, dispose } // interface, reports errors as properties change d

1. Implementing a validator
aurelia-validatejs
  Validator { Validate(object) // calls validate config }
  ValidateConfig
  ValidationObserver { ctor(obj, propsThatImpactRules, validator)}
  validatejs specific decorators, fluent api
  (might use ValidationObserver)
  implement reporter interface

1. Implementing a validator
aurelia-breeze
  Validator // normally looks at entityAspect
  (breeze has own rule definition api)
  (never needs ValidationObserver)
  implement reporter interface

aurelia-templating-validation
  BootstrapFormGroupRenderer - binding behavior to render errors




Plugin configure method -

import {Validator} from 'aurelia-validation';
import {Validator as ValidateJSValidator} from './validator';
import {Reporter} from 'aurelia-validation';
import {Reporter as ValidateJSReporter} from './validator';

  container.registerHandler(Validator, ValidateJSValidator)
