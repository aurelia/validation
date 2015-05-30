import {NoSpacesValidationRule} from '../../src/validation/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'isNotEmpty()'

describe('Tests on NoSpacesValidationRule', () => {
  it('should be working with no spaces', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new NoSpacesValidationRule();
    expectations.expectAsync(rule.validate('a')).toBe(true);
    expectations.expectAsync(rule.validate('A')).toBe(true);
    expectations.expectAsync(rule.validate(1337)).toBe(true);
    expectations.expectAsync(rule.validate('1337')).toBe(true);
    expectations.expectAsync(rule.validate('&*(')).toBe(true);
    expectations.validate();
  });
  it('should not be working with whitespaces', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new NoSpacesValidationRule();
    expectations.expectAsync(rule.validate('a a')).toBe(false);
    expectations.expectAsync(rule.validate('A A')).toBe(false);
    expectations.expectAsync(rule.validate('A ')).toBe(false);
    expectations.expectAsync(rule.validate(' A')).toBe(false);
    expectations.validate();
  });
});
