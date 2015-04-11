import {AlphaNumericOrWhitespaceValidationRule} from '../../src/validation/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'isNotEmpty()'

describe('Tests on AlphaNumericOrWhitespaceValidationRule', () => {
  it('should be working with only digits', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new AlphaNumericOrWhitespaceValidationRule();
    expectations.expectAsync(rule.validate('2')).toBe(true);
    expectations.expectAsync(rule.validate(2)).toBe(true);
    expectations.expectAsync(rule.validate(' 1 2 3 4 5 6 7 8 9 0')).toBe(true);
    expectations.expectAsync(rule.validate(1234567890)).toBe(true);
    expectations.validate();
  });
  it('should be working with only characters', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new AlphaNumericOrWhitespaceValidationRule();
    expectations.expectAsync(rule.validate('a')).toBe(true);
    expectations.expectAsync(rule.validate('a B c D e F g H i J k L m N o P q R s T u V w X y Z')).toBe(true);
    expectations.validate();
  });

  it('should be working with a combination of alphanumeric characters', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new AlphaNumericOrWhitespaceValidationRule();
    expectations.expectAsync(rule.validate('aBcDeFgHiJkLmNoPqRsTuVwXyZ 1234567890')).toBe(true);
    expectations.expectAsync(rule.validate('1234567890aBcDe F g H i JkLm1234567890NoPq R s T u VwXyZ1234567890')).toBe(true);
    expectations.validate();
  });

  it('should not be working with non alphanumerical characters', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new AlphaNumericOrWhitespaceValidationRule();
    expectations.expectAsync(rule.validate('van der haegen j@gmail.com')).toBe(false);
    expectations.expectAsync(rule.validate('123,1 23')).toBe(false);
    expectations.expectAsync(rule.validate('abc !')).toBe(false);
    expectations.expectAsync(rule.validate('!@#$ % ^&*()_+')).toBe(false);
    expectations.validate();
  });

  it('should be working with whitespace characters', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new AlphaNumericOrWhitespaceValidationRule();
    expectations.expectAsync(rule.validate('abc 123')).toBe(true);

    //Note: spaces are always trimmed
    expectations.expectAsync(rule.validate(' abc 123 ')).toBe(true);
    expectations.validate();

  });
});
