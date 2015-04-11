import {StrongPasswordValidationRule} from '../../src/validation/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on StrongPasswordValidationRule', () => {
  it('should be working with strong passwords', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new StrongPasswordValidationRule();
    expectations.expectAsync(rule.validate('aBcdE*123')).toBe(true);
    expectations.validate();
  });

  it('should respect the minimum complexity level', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new StrongPasswordValidationRule(); //default complexity level is 4
    expectations.expectAsync(rule.validate('aBcdEfG*1')).toBe(true);
    expectations.expectAsync(rule.validate('aBcdEfG*')).toBe(false);
    expectations.expectAsync(rule.validate('aBcdEfG1')).toBe(false);
    expectations.expectAsync(rule.validate('abcdefg*1')).toBe(false);
    expectations.expectAsync(rule.validate('ABCDEFG*1')).toBe(false);
    expectations.validate();

  });
  it('should respect the minimum complexity level', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new StrongPasswordValidationRule(3); //allows 'medium' passwords
    expectations.expectAsync(rule.validate('aBcdEfG*1')).toBe(true);
    expectations.expectAsync(rule.validate('aBcdEfG*S')).toBe(true);
    expectations.expectAsync(rule.validate('aBcdEfG1')).toBe(true);
    expectations.expectAsync(rule.validate('abcdefg*1')).toBe(true);
    expectations.expectAsync(rule.validate('ABCDEFG*1')).toBe(true);
    expectations.expectAsync(rule.validate('ABCDEFG123')).toBe(false);
    expectations.expectAsync(rule.validate('123abcdefg')).toBe(false);
    expectations.validate();
  });
});
