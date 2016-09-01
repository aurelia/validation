import {Container} from 'aurelia-dependency-injection';
import {BindingLanguage} from 'aurelia-templating'
import {TemplatingBindingLanguage} from 'aurelia-templating-binding';
import {
  StandardValidator,
  ValidationRules,
  ValidationParser,
  ValidationError
} from '../src/aurelia-validation';

declare var describe: { (name: string, fn: () => void): void };
declare var beforeAll: { (fn: () => void): void };
declare var it: { (name: string, fn: (done?: () => void) => void): void };
declare var expect: (x: any) => any;

describe('Validator', () => {
  let validator: StandardValidator;

  function fixId(error: ValidationError) {
    error.id--;
    return error;
  }

  beforeAll(() => {
    const container = new Container();
    container.registerInstance(BindingLanguage, container.get(TemplatingBindingLanguage));
    const parser = container.get(ValidationParser);
    ValidationRules.initialize(parser);
    validator = container.get(StandardValidator);    
  });

  it('validates email', (done: () => void) => {    
    let obj = { prop: <any>'foo@bar.com' };
    let rules = ValidationRules.ensure('prop').email().rules;
    validator.validateProperty(obj, 'prop', rules)
      .then(errors => expect(errors).toEqual([]))
      .then(() => {
        obj = { prop: 'foo' };
        rules = ValidationRules.ensure('prop').email().rules;
        return validator.validateProperty(obj, 'prop', rules);        
      })
      .then(errors => expect(errors).toEqual([fixId(new ValidationError(rules[0], 'Prop is not a valid email.', obj, 'prop'))]))
      .then(() => {
        obj = { prop: null };
        rules = ValidationRules.ensure('prop').email().rules;
        return validator.validateProperty(obj, 'prop', rules);
      })
      .then(errors => expect(errors).toEqual([]))
      .then(done);
  });

  it('validates equals', (done: () => void) => {    
    let obj = { prop: <any>'test' };
    let rules = ValidationRules.ensure('prop').equals('test').rules;
    validator.validateProperty(obj, 'prop', rules)
      .then(errors => expect(errors).toEqual([]))
      .then(() => {
        obj = { prop: 'foo' };
        rules = ValidationRules.ensure('prop').equals('test').rules;
        return validator.validateProperty(obj, 'prop', rules);        
      })
      .then(errors => expect(errors).toEqual([fixId(new ValidationError(rules[0], 'Prop must be test.', obj, 'prop'))]))
      .then(() => {
        obj = { prop: null };
        rules = ValidationRules.ensure('prop').equals('test').rules;
        return validator.validateProperty(obj, 'prop', rules);
      })
      .then(errors => expect(errors).toEqual([]))
      .then(done);
  });
});
