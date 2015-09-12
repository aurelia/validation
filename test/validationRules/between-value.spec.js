import {BetweenValueValidationRule} from '../../src/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'isNotEmpty()'
//Both limits are inclusive

describe('Tests on BetweenValueValidationRule', () => {
  it('should be working with integers', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new BetweenValueValidationRule(2, 3);
    expectations.expectAsync(rule.validate(1)).toBe(false);
    expectations.expectAsync(rule.validate(2)).toBe(true);
    expectations.expectAsync(rule.validate(3)).toBe(true);
    expectations.expectAsync(rule.validate(4)).toBe(false);
    expectations.validate();
  });

  it('should be working with decimals', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new BetweenValueValidationRule(2, 3);
    expectations.expectAsync(rule.validate(1.9)).toBe(false);
    expectations.expectAsync(rule.validate(2.0)).toBe(true);
    expectations.expectAsync(rule.validate(2.99)).toBe(true);
    expectations.expectAsync(rule.validate(4.0)).toBe(false);
    expectations.validate();
  });


  it('should be working with dates', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new BetweenValueValidationRule(new Date(2000, 1, 1, 1, 1, 1, 1), new Date(2000, 1, 1, 1, 1, 2, 1));
    expectations.expectAsync(rule.validate(new Date(1999, 1, 1, 1, 1, 1, 1))).toBe(false);
    expectations.expectAsync(rule.validate(new Date(2000, 1, 1, 1, 1, 1, 1))).toBe(true);
    expectations.expectAsync(rule.validate(new Date(2000, 1, 1, 1, 1, 1, 30))).toBe(true);
    expectations.expectAsync(rule.validate(new Date(2000, 1, 1, 1, 1, 2, 1))).toBe(true);
    expectations.expectAsync(rule.validate(new Date(2000, 1, 1, 1, 1, 2, 2))).toBe(false);
    expectations.validate();
  });
});
