import {EmailValidationRule} from '../../src/validation/validation-rules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on EmailValidationRule', () => {
  it('should be working with valid email addresses', () => {
    var rule = new EmailValidationRule();
    expect(rule.validate('van.der.haegen.j@gmail.com')).toBe(true);
    expect(rule.validate('bob-the@builder.com')).toBe(true);
    expect(rule.validate('long_address_123@some.domain.com.gov.mx')).toBe(true);
  });

  it('should not be working with missing @', () => {
    var rule = new EmailValidationRule();
    expect(rule.validate('van.der.haegen.jgmail.com')).toBe(false);
  });

  it('should not be working with addresses without identifier', () => {
    var rule = new EmailValidationRule();
    expect(rule.validate('@gmail.com')).toBe(false);
  });

  it('should not be working with duplicate @', () => {
    var rule = new EmailValidationRule();
    expect(rule.validate('van.der.haegen@j@gmail.com')).toBe(false);
  });

  it('should not be working with duplicate .', () => {
    var rule = new EmailValidationRule();
    expect(rule.validate('van.der.haegen.j@gmail.com')).toBe(true);
    expect(rule.validate('van..der.haegen.j@gmail.com')).toBe(false);
  });

  it('should not be working with duplicate _', () => {
    var rule = new EmailValidationRule();
    expect(rule.validate('van_der_haegen_j@g_mail.com')).toBe(true);
    expect(rule.validate('van_der_haegen_j@g__mail.com')).toBe(false);
  });

  it('should not be working with addresses ending in dot', () => {
    var rule = new EmailValidationRule();
    expect(rule.validate('van.der.haegen.j@gmail.com.')).toBe(false);
    expect(rule.validate('van.der.haegen.j@gmail..')).toBe(false);
  });

});
