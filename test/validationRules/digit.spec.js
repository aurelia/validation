import {DigitValidationRule} from '../../src/validation/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on DigitValidationRule', () => {
  it('should be working with strings', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new DigitValidationRule();
    expectations.expectAsync(rule.validate('a')).toBe(false);
    expectations.expectAsync(rule.validate('15')).toBe(true);
    expectations.validate();
  });
  it('should be working with simple numbers', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new DigitValidationRule();
    expectations.expectAsync(rule.validate(3)).toBe(true);
    expectations.expectAsync(rule.validate(-3)).toBe(false);
    expectations.validate();
  });
  it('should not be working with decimals', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new DigitValidationRule();
    expectations.expectAsync(rule.validate(3.01)).toBe(false);
    expectations.validate();
  });
  it('should not be working with properly formatted numbers', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new DigitValidationRule();
    expectations.expectAsync(rule.validate('300,000.14')).toBe(false);
    expectations.validate();
  });
});
