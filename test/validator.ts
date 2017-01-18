import { Container } from 'aurelia-dependency-injection';
import { BindingLanguage } from 'aurelia-templating';
import { TemplatingBindingLanguage } from 'aurelia-templating-binding';
import {
  StandardValidator,
  ValidationRules,
  ValidationParser,
  ValidateResult
} from '../src/aurelia-validation';

describe('Validator', () => {
  let validator: StandardValidator;
  let parser: ValidationParser;

  beforeAll(() => {
    const container = new Container();
    container.registerInstance(BindingLanguage, container.get(TemplatingBindingLanguage));
    parser = container.get(ValidationParser);
    ValidationRules.initialize(parser);
    validator = container.get(StandardValidator);
  });

  it('validates email', (done: () => void) => {
    let obj = { prop: 'foo@bar.com' as any };
    let rules = ValidationRules.ensure('prop').email().rules;
    validator.validateProperty(obj, 'prop', rules)
      .then(results => {
        const expected = [new ValidateResult(rules[0][0], obj, 'prop', true, null)];
        expected[0].id = results[0].id;
        expect(results).toEqual(expected);
      })
      .then(() => {
        obj = { prop: 'foo' };
        rules = ValidationRules.ensure('prop').email().rules;
        return validator.validateProperty(obj, 'prop', rules);
      })
      .then(results => {
        const expected = [new ValidateResult(rules[0][0], obj, 'prop', false, 'Prop is not a valid email.')];
        expected[0].id = results[0].id;
        expect(results).toEqual(expected);
      })
      .then(() => {
        obj = { prop: null };
        rules = ValidationRules.ensure('prop').email().rules;
        return validator.validateProperty(obj, 'prop', rules);
      })
      .then(results => {
        const expected = [new ValidateResult(rules[0][0], obj, 'prop', true, null)];
        expected[0].id = results[0].id;
        expect(results).toEqual(expected);
      })
      .then(done);
  });

  it('validates equals', (done: () => void) => {
    let obj = { prop: 'test' as any };
    let rules = ValidationRules.ensure('prop').equals('test').rules;
    validator.validateProperty(obj, 'prop', rules)
      .then(results => {
        const expected = [new ValidateResult(rules[0][0], obj, 'prop', true, null)];
        expected[0].id = results[0].id;
        expect(results).toEqual(expected);
      })
      .then(() => {
        obj = { prop: 'foo' };
        rules = ValidationRules.ensure('prop').equals('test').rules;
        return validator.validateProperty(obj, 'prop', rules);
      })
      .then(results => {
        const expected = [new ValidateResult(rules[0][0], obj, 'prop', false, 'Prop must be test.')];
        expected[0].id = results[0].id;
        expect(results).toEqual(expected);
      })
      .then(() => {
        obj = { prop: null };
        rules = ValidationRules.ensure('prop').equals('test').rules;
        return validator.validateProperty(obj, 'prop', rules);
      })
      .then(results => {
        const expected = [new ValidateResult(rules[0][0], obj, 'prop', true, null)];
        expected[0].id = results[0].id;
        expect(results).toEqual(expected);
      })
      .then(done);
  });

  it('bails', (done: () => void) => {
    let obj = { prop: 'invalid email', prop2: '' };
    const spy1 = jasmine.createSpy().and.returnValue(true);
    const spy2 = jasmine.createSpy().and.returnValue(true);
    const rules = ValidationRules
      .ensure('prop').email().then().satisfies(spy1)
      .ensure('prop2').satisfies(spy2)
      .rules;
    validator.validateProperty(obj, 'prop', rules)
      .then(results => {
        const expected = [new ValidateResult(rules[0][0], obj, 'prop', false, 'Prop is not a valid email.')];
        expected[0].id = results[0].id;
        expect(results).toEqual(expected);
        expect(spy1.calls.count()).toBe(0);
      })
      .then(() => validator.validateObject(obj, rules))
      .then(results => {
        const expected = [
          new ValidateResult(rules[0][0], obj, 'prop', false, 'Prop is not a valid email.'),
          new ValidateResult(rules[0][1], obj, 'prop2', true, null)];
        expected[0].id = results[0].id;
        expected[1].id = results[1].id;
        expect(results).toEqual(expected);
        expect(spy1.calls.count()).toBe(0);
        expect(spy2.calls.count()).toBe(1);
      })
      .then(() => {
        obj = { prop: 'foo@bar.com', prop2: '' };
        return validator.validateProperty(obj, 'prop', rules);
      })
      .then(results => {
        const expected = [
          new ValidateResult(rules[0][0], obj, 'prop', true),
          new ValidateResult(rules[1][0], obj, 'prop', true),
        ];
        expected[0].id = results[0].id;
        expected[1].id = results[1].id;
        expect(results).toEqual(expected);
        expect(spy1.calls.count()).toBe(1);
      })
      .then(done);
  });

  it('handles multiple ensures on a property', (done: () => void) => {
    const obj = { name: 'value' };
    const displayName = 'product name';
    const message = `${displayName} is required`;
    const propertyName = 'name';
    // const message = parser.parseMessage('${displayName}');

    // jasmine.createSpyObj(message, ['evaluate']).and.returnValue(displayName);

    const rules = ValidationRules
      .ensure(propertyName)
      .displayName(displayName)
      .ensure(propertyName)
      .required()
      .withMessage('\${$displayName} is required')
      .on(obj)
      .rules;

    validator.validateProperty(obj, propertyName, rules)
      .then((results: Array<ValidateResult>) => {
        expect(results.length === 0);

        (obj as any).name = null;
        return validator.validateProperty(obj, propertyName, rules);
      })
      .then((results: Array<ValidateResult>) => {
        expect(results.length === 1);
        expect(results[0].message).toEqual(message);
      })
      // .then(() => {
      //   obj = { prop: 'foo' };
      //   rules = ValidationRules.ensure('prop').equals('test').rules;
      //   return validator.validateProperty(obj, 'prop', rules);
      // })
      // .then(results => {
      //   const expected = [new ValidateResult(rules[0][0], obj, 'prop', false, 'Prop must be test.')];
      //   expected[0].id = results[0].id;
      //   expect(results).toEqual(expected);
      // })
      // .then(() => {
      //   obj = { prop: null };
      //   rules = ValidationRules.ensure('prop').equals('test').rules;
      //   return validator.validateProperty(obj, 'prop', rules);
      // })
      // .then(results => {
      //   const expected = [new ValidateResult(rules[0][0], obj, 'prop', true, null)];
      //   expected[0].id = results[0].id;
      //   expect(results).toEqual(expected);
      // })
      .then(done);
  });
});
