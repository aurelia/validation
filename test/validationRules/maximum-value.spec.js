import {MaximumValueValidationRule} from '../../src/validation/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on MaximumValueValidationRule', () => {
  it('should be working with integers', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new MaximumValueValidationRule(3);
    expectations.expectAsync(rule.validate(1)).toBe(true);
    expectations.expectAsync(rule.validate(2)).toBe(true);
    expectations.expectAsync(rule.validate(3)).toBe(false);
    expectations.expectAsync(rule.validate(4)).toBe(false);
    expectations.validate();
  });

  it('should be working with decimals', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new MaximumValueValidationRule(3);
    expectations.expectAsync(rule.validate(2.9)).toBe(true);
    expectations.expectAsync(rule.validate(2.99)).toBe(true);
    expectations.expectAsync(rule.validate(3.00)).toBe(false);
    expectations.expectAsync(rule.validate(3.01)).toBe(false);
    expectations.validate();
  });


  it('should be working with dates', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new MaximumValueValidationRule(new Date(2000, 1, 1, 1, 1, 1, 1));
    expectations.expectAsync(rule.validate(new Date(1999, 1, 1, 1, 1, 1, 1))).toBe(true);
    expectations.expectAsync(rule.validate(new Date(2000, 1, 1, 1, 1, 1, 0))).toBe(true);
    expectations.expectAsync(rule.validate(new Date(2000, 1, 1, 1, 1, 1, 1))).toBe(false);
    expectations.expectAsync(rule.validate(new Date(2000, 1, 1, 1, 1, 1, 2))).toBe(false);
    expectations.validate();
  });
});
