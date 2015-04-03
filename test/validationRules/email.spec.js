import {EmailValidationRule} from '../../src/validation/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on EmailValidationRule', () => {
  it('should be working with valid email addresses', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new EmailValidationRule();
    expectations.expectAsync(rule.validate('van.der.haegen.j@gmail.com')).toBe(true);
    expectations.expectAsync(rule.validate('bob-the@builder.com')).toBe(true);
    expectations.expectAsync(rule.validate('long_address_123@some.domain.com.gov.mx')).toBe(true);
    expectations.validate();
  });

  it('should not be working with missing @', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new EmailValidationRule();
    expectations.expectAsync(rule.validate('van.der.haegen.jgmail.com')).toBe(false);
    expectations.validate();
  });

  it('should not be working with addresses without identifier', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new EmailValidationRule();
    expectations.expectAsync(rule.validate('@gmail.com')).toBe(false);
    expectations.validate();
  });

  it('should not be working with duplicate @', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new EmailValidationRule();
    expectations.expectAsync(rule.validate('van.der.haegen@j@gmail.com')).toBe(false);
    expectations.validate();
  });

  it('should not be working with duplicate .', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new EmailValidationRule();
    expectations.expectAsync(rule.validate('van.der.haegen.j@gmail.com')).toBe(true);
    expectations.expectAsync(rule.validate('van..der.haegen.j@gmail.com')).toBe(false);
    expectations.validate();
  });

  it('should not be working with duplicate _', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new EmailValidationRule();
    expectations.expectAsync(rule.validate('van_der_haegen_j@g_mail.com')).toBe(true);
    expectations.expectAsync(rule.validate('van_der_haegen_j@g__mail.com')).toBe(false);
    expectations.validate();
  });

  it('should not be working with addresses ending in dot', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new EmailValidationRule();
    expectations.expectAsync(rule.validate('van.der.haegen.j@gmail.com.')).toBe(false);
    expectations.expectAsync(rule.validate('van.der.haegen.j@gmail..')).toBe(false);
    expectations.validate();
  });

});
