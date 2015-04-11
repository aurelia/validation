import {AlphaNumericValidationRule} from '../../src/validation/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on AlphaNumericValidationRule', () => {
  it('should be working with only digits', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new AlphaNumericValidationRule();
    expectations.expectAsync(rule.validate('2')).toBe(true);
    expectations.expectAsync(rule.validate(2)).toBe(true);
    expectations.expectAsync(rule.validate('1234567890')).toBe(true);
    expectations.expectAsync(rule.validate(1234567890)).toBe(true);
    expectations.validate();
  });
  it('should be working with only characters', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new AlphaNumericValidationRule();
    expectations.expectAsync(rule.validate('a')).toBe(true);
    expectations.expectAsync(rule.validate('aBcDeFgHiJkLmNoPqRsTuVwXyZ')).toBe(true);
    expectations.validate();
  });

  it('should be working with a combination of alphanumeric characters', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new AlphaNumericValidationRule();
    expectations.expectAsync(rule.validate('aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890')).toBe(true);
    expectations.expectAsync(rule.validate('1234567890aBcDeFgHiJkLm1234567890NoPqRsTuVwXyZ1234567890')).toBe(true);
    expectations.validate();
  });

  it('should not be working with non alphanumerical characters', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new AlphaNumericValidationRule();
    expectations.expectAsync(rule.validate('van.der.haegen.j@gmail.com')).toBe(false);
    expectations.expectAsync(rule.validate('123,123')).toBe(false);
    expectations.expectAsync(rule.validate('abc!')).toBe(false);
    expectations.expectAsync(rule.validate('!@#$%^&*()_+')).toBe(false);
    expectations.validate();
  });

  it('should not be working with whitespace characters', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new AlphaNumericValidationRule();
    expectations.expectAsync(rule.validate('abc 123')).toBe(false);

    //Note: spaces are no longer trimmed
    expectations.expectAsync(rule.validate(' abc123 ')).toBe(false);
    expectations.validate();

  });
});
