import {MinimumInclusiveValueValidationRule} from '../../src/validation/validation-rules'
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'isNotEmpty()'

describe('Tests on MinimumValueValidationRule', () => {
  it('should be working with integers', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new MinimumInclusiveValueValidationRule(3);
    expectations.expectAsync(rule.validate(1)).toBe(false);
    expectations.expectAsync(rule.validate(2)).toBe(false);
    expectations.expectAsync(rule.validate(3)).toBe(true);
    expectations.expectAsync(rule.validate(4)).toBe(true);
    expectations.validate();
  });

  it('should be working with decimals', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new MinimumInclusiveValueValidationRule(3);
    expectations.expectAsync(rule.validate(2.9)).toBe(false);
    expectations.expectAsync(rule.validate(2.99)).toBe(false);
    expectations.expectAsync(rule.validate(3.00)).toBe(true);
    expectations.expectAsync(rule.validate(3.01)).toBe(true);
    expectations.validate();
  });


  it('should be working with dates', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new MinimumInclusiveValueValidationRule(new Date(2000, 1, 1, 1, 1, 1, 1));
    expectations.expectAsync(rule.validate(new Date(1999, 1, 1, 1, 1, 1, 1))).toBe(false);
    expectations.expectAsync(rule.validate(new Date(2000, 1, 1, 1, 1, 1, 0))).toBe(false);
    expectations.expectAsync(rule.validate(new Date(2000, 1, 1, 1, 1, 1, 1))).toBe(true);
    expectations.expectAsync(rule.validate(new Date(2000, 1, 1, 1, 1, 1, 2))).toBe(true);
    expectations.validate();
  });
});
