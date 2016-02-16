import {ValidationRule} from 'src/validation-rule';

describe('ValidationRule', () => {
  let subject;

  describe('.constructor', () => {
    it('instantiates with name and config assigned', () => {
      let name = 'Testing';
      let config = { minimum: 5 };
      subject = new ValidationRule(name, config);
      expect(subject.name).toEqual(name);
      expect(subject.config).toEqual(config);
    });
  });

  describe('.validate', () => {
    let validationRule;

    it('throw error when missing target and no errors exist', () => {
      let target = { name: 'Patrick' };
      validationRule = new ValidationRule(null);
      expect(() => { validationRule.validate(target) }).toThrow(new Error('Invalid target or property name.'));
    });

    it('return undefined when no errors exist', () => {
      let target = { name: 'Patrick' };
      validationRule = new ValidationRule('length', { minimum: 5 });
      let result = validationRule.validate(target, 'name');
      expect(result).toEqual(undefined);
    });

    it('return errors when errors exist', () => {
      let target = { name: 'Patrick' };
      validationRule = new ValidationRule('length', { minimum: 10 });
      let result = validationRule.validate(target, 'name');
      expect(result).not.toEqual(undefined);
    });
  });
});
