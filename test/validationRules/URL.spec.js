import {URLValidationRule} from '../../src/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'isNotEmpty()'

describe('Tests on URLValidationRule', () => {
  it('should be working with valid URL addresses', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new URLValidationRule();
    expectations.expectAsync(rule.validate('www.google.com')).toBe(true);
    expectations.expectAsync(rule.validate('http://www.google.com')).toBe(true);
    expectations.expectAsync(rule.validate('google.com')).toBe(true);
    expectations.expectAsync(rule.validate('https://www.google.com')).toBe(true);
    expectations.expectAsync(rule.validate('ftp://www.google.com')).toBe(true);
    expectations.expectAsync(rule.validate('www.goog_le.com')).toBe(true);
    expectations.expectAsync(rule.validate('www.google.com/something')).toBe(true);
    expectations.expectAsync(rule.validate('google.com/search&q+hello%20world')).toBe(true);
    expectations.validate();
  });

  it('should not be working with invalid URL', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new URLValidationRule();
    expectations.expectAsync(rule.validate('google')).toBe(false);
    expectations.expectAsync(rule.validate('google.com_')).toBe(false);
    expectations.expectAsync(rule.validate('goog le.com')).toBe(false);
    expectations.validate();
  });

});
