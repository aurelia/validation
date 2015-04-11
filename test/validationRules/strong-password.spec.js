import {StrongPasswordValidationRule} from '../../src/validation/validation-rules';
import {MediumPasswordValidationRule} from '../../src/validation/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'isNotEmpty()'

describe('Tests on StrongPasswordValidationRule', () => {
  it('should be working with strong passwords', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new StrongPasswordValidationRule();
    expectations.expectAsync(rule.validate('aBcdE*123')).toBe(true);
    expectations.validate();
  });

  it('should not be working with a medium password', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new StrongPasswordValidationRule(); //default complexity level is 4
    expectations.expectAsync(rule.validate('aBcdEfG*1')).toBe(true);
    expectations.expectAsync(rule.validate('aBcdEfG*')).toBe(false);
    expectations.expectAsync(rule.validate('aBcdEfG1')).toBe(false);
    expectations.expectAsync(rule.validate('abcdefg*1')).toBe(false);
    expectations.expectAsync(rule.validate('ABCDEFG*1')).toBe(false);
    expectations.validate();
  });

  it('should give a correct translation', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new StrongPasswordValidationRule(); //default complexity level is 4
    expectations.expectAsync(rule.validate('aBcdEfG*')).toBe(false);
    expectations.expectAsync(() => {
      return rule.explain();
    }).toBe('should contain a combination of lowercase letters, uppercase letters, digits and special characters');
    expectations.validate();
  });
});
describe('tests on MediumPasswordValidationRule', () => {
  it('should respect the minimum complexity level', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new MediumPasswordValidationRule(); //default complexity level is 3
    expectations.expectAsync(rule.validate('aBcdEfG*1')).toBe(true);
    expectations.expectAsync(rule.validate('aBcdEfG*S')).toBe(true);
    expectations.expectAsync(rule.validate('aBcdEfG1')).toBe(true);
    expectations.expectAsync(rule.validate('abcdefg*1')).toBe(true);
    expectations.expectAsync(rule.validate('ABCDEFG*1')).toBe(true);
    expectations.expectAsync(rule.validate('ABCDEFG123')).toBe(false);
    expectations.expectAsync(rule.validate('123abcdefg')).toBe(false);
    expectations.validate();
  });
  it('should respect the minimum complexity level', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new MediumPasswordValidationRule(2); //default complexity level is 3
    expectations.expectAsync(rule.validate('aBcdEfG*1')).toBe(true);
    expectations.expectAsync(rule.validate('aBcdEfG*S')).toBe(true);
    expectations.expectAsync(rule.validate('aBcdEfG1')).toBe(true);
    expectations.expectAsync(rule.validate('abcdefg*1')).toBe(true);
    expectations.expectAsync(rule.validate('ABCDEFG*1')).toBe(true);
    expectations.expectAsync(rule.validate('ABCDEFG123')).toBe(true);
    expectations.expectAsync(rule.validate('123abcdefg')).toBe(true);
    expectations.expectAsync(rule.validate('abcdefg')).toBe(false);
    expectations.expectAsync(rule.validate('12345789')).toBe(false);
    expectations.expectAsync(rule.validate('aBcDeFgH')).toBe(true);
    expectations.validate();
  });
  it('should give a correct translation', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new MediumPasswordValidationRule(2); //default complexity level is 3
    expectations.expectAsync(rule.validate('abcdefghij')).toBe(false);
    expectations.expectAsync(() => {
      return rule.explain();
    }).toBe('should contain at least 2 of the following groups: lowercase letters, uppercase letters, digits or special characters');
    expectations.validate();
  });
});
