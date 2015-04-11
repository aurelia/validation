import {BetweenLengthValidationRule} from '../../src/validation/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'isNotEmpty()'
//Both limits are inclusive

describe('Tests on BetweenLengthValidationRule', () => {
  it('should be working with strings', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new BetweenLengthValidationRule(2, 3);
    expectations.expectAsync(rule.validate('a')).toBe(false);
    expectations.expectAsync(rule.validate('ab')).toBe(true);
    expectations.expectAsync(rule.validate('abc')).toBe(true);
    expectations.expectAsync(rule.validate('abcd')).toBe(false);
    expectations.validate();
  });

  it('should trim strings before evaluating', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new BetweenLengthValidationRule(2, 3);
    expectations.expectAsync(rule.validate('a')).toBe(false);
    expectations.expectAsync(rule.validate(' a')).toBe(true);
    expectations.expectAsync(rule.validate('a  ')).toBe(true);
    expectations.expectAsync(rule.validate('  a  ')).toBe(false);
    expectations.validate();
  });
  it('should be working with arrays', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new BetweenLengthValidationRule(2, 3);
    expectations.expectAsync(rule.validate([1])).toBe(false);
    expectations.expectAsync(rule.validate([1, 2])).toBe(true);
    expectations.expectAsync(rule.validate([1, 2, 3])).toBe(true);
    expectations.expectAsync(rule.validate([1, 2, 3, 4])).toBe(false);
    expectations.validate();
  });

  it('should be working with with any object that has a "length" property', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new BetweenLengthValidationRule(2, 3);
    expectations.expectAsync(rule.validate({length: 1})).toBe(false);
    expectations.expectAsync(rule.validate({length: 2})).toBe(true);
    expectations.expectAsync(rule.validate({length: 3})).toBe(true);
    expectations.expectAsync(rule.validate({length: 4})).toBe(false);
    expectations.validate();
  });
});
