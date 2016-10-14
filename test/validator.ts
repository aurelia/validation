import { Container } from 'aurelia-dependency-injection';
import { BindingLanguage } from 'aurelia-templating';
import { TemplatingBindingLanguage } from 'aurelia-templating-binding';
import {
  StandardValidator,
  ValidationRules,
  ValidationParser,
  ValidationError
} from '../src/aurelia-validation';

describe('Validator', () => {
  let validator: StandardValidator;

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
      .then(errors => {
        const expected = [new ValidationError(rules[0][0], 'Prop is not a valid email.', obj, 'prop')];
        expected[0].id = errors[0].id;
        expect(errors).toEqual(expected);
      })
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
      .then(errors => {
        const expected = [new ValidationError(rules[0][0], 'Prop must be test.', obj, 'prop')];
        expected[0].id = errors[0].id;
        expect(errors).toEqual(expected);
      })
      .then(() => {
        obj = { prop: null };
        rules = ValidationRules.ensure('prop').equals('test').rules;
        return validator.validateProperty(obj, 'prop', rules);
      })
      .then(errors => expect(errors).toEqual([]))
      .then(done);
  });

  it('bails', (done: () => void) => {
    let obj = { prop: <any>'invalid email' };
    let spy = jasmine.createSpy().and.returnValue(true);
    let rules = ValidationRules.ensure('prop').email().then().satisfies(spy).rules;
    validator.validateProperty(obj, 'prop', rules)
      .then(errors => {
        const expected = [new ValidationError(rules[0][0], 'Prop is not a valid email.', obj, 'prop')];
        expected[0].id = errors[0].id;
        expect(errors).toEqual(expected);
        expect(spy.calls.count()).toBe(0);
      })
      .then(() => {
        obj = { prop: 'foo@bar.com' };
        return validator.validateProperty(obj, 'prop', rules);
      })
      .then(errors => {
        expect(errors).toEqual([]);
        expect(spy.calls.count()).toBe(1);
      })
      .then(done);
  });
});
