import {NumericValidationRule} from '../../src/validation/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'isNotEmpty()'

describe('Tests on NumericValidationRule', () => {
  it('should be working with strings', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new NumericValidationRule();
    expectations.expectAsync(rule.validate('a')).toBe(false);
    expectations.expectAsync(rule.validate('15')).toBe(true);
    expectations.validate();
  });
  it('should be working with simple numbers', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new NumericValidationRule();
    expectations.expectAsync(rule.validate(3)).toBe(true);
    expectations.expectAsync(rule.validate(-3)).toBe(true);
    expectations.validate();
  });
  it('should be working with decimals', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new NumericValidationRule();
    expectations.expectAsync(rule.validate(3.01)).toBe(true);
    expectations.expectAsync(rule.validate(-3.15)).toBe(true);
    expectations.expectAsync(rule.validate(-1234567.890123)).toBe(true);
    expectations.validate();
  });
  it('should be working with properly formatted numbers', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new NumericValidationRule();
    expectations.expectAsync(rule.validate('300,000.14')).toBe(true);
    expectations.expectAsync(rule.validate('1,234,300,000.14172727')).toBe(true);
    expectations.expectAsync(rule.validate('-1,234,300,000.14172727')).toBe(true);
    expectations.expectAsync(rule.validate('.12323121')).toBe(true);

    expectations.expectAsync(rule.validate('3,12,9')).toBe(false);
    expectations.expectAsync(rule.validate('-3,12.2')).toBe(false);
    expectations.expectAsync(rule.validate('-3,123.')).toBe(false);
    expectations.expectAsync(rule.validate('-3,123.7.7')).toBe(false);
    expectations.expectAsync(rule.validate('-0.733,933')).toBe(false);
    expectations.validate();


  });
  it('should be working with un-properly formatted numbers', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new NumericValidationRule();
    expectations.expectAsync(rule.validate('300000.1419191991')).toBe(true);
    expectations.validate();
  });
});
