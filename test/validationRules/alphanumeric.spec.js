import {AlphaNumericValidationRule} from '../../src/validation/validation-rules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on AlphaNumericValidationRule', () => {
    it('should be working with only digits', () => {
        var rule = new AlphaNumericValidationRule();
        expect(rule.validate('2')).toBe(true);
        expect(rule.validate(2)).toBe(true);
        expect(rule.validate('1234567890')).toBe(true);
        expect(rule.validate(1234567890)).toBe(true);
    });
    it('should be working with only characters', () => {
        var rule = new AlphaNumericValidationRule();
        expect(rule.validate('a')).toBe(true);
        expect(rule.validate('aBcDeFgHiJkLmNoPqRsTuVwXyZ')).toBe(true);
    });

    it('should be working with a combination of alphanumeric characters', () => {
        var rule = new AlphaNumericValidationRule();
        expect(rule.validate('aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890')).toBe(true);
        expect(rule.validate('1234567890aBcDeFgHiJkLm1234567890NoPqRsTuVwXyZ1234567890')).toBe(true);
    });

    it('should not be working with non alphanumerical characters', () => {
        var rule = new AlphaNumericValidationRule();
        expect(rule.validate('van.der.haegen.j@gmail.com')).toBe(false);
        expect(rule.validate('123,123')).toBe(false);
        expect(rule.validate('abc!')).toBe(false);
        expect(rule.validate('!@#$%^&*()_+')).toBe(false);
    });

    it('should not be working with whitespace characters', () => {
        var rule = new AlphaNumericValidationRule();
        expect(rule.validate('abc 123')).toBe(false);

        //Note: spaces are always trimmed
        expect(rule.validate(' abc123 ')).toBe(true);

    });
});
