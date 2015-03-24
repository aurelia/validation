import {AlphaNumericOrWhitespaceValidationRule} from '../../src/validation/validationRules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on AlphaNumericOrWhitespaceValidationRule', () => {
    it('should be working with only digits', () => {
        var rule = new AlphaNumericOrWhitespaceValidationRule();
        expect(rule.validate('2')).toBe(true);
        expect(rule.validate(2)).toBe(true);
        expect(rule.validate(' 1 2 3 4 5 6 7 8 9 0')).toBe(true);
        expect(rule.validate(1234567890)).toBe(true);
    });
    it('should be working with only characters', () => {
        var rule = new AlphaNumericOrWhitespaceValidationRule();
        expect(rule.validate('a')).toBe(true);
        expect(rule.validate('a B c D e F g H i J k L m N o P q R s T u V w X y Z')).toBe(true);
    });

    it('should be working with a combination of alphanumeric characters', () => {
        var rule = new AlphaNumericOrWhitespaceValidationRule();
        expect(rule.validate('aBcDeFgHiJkLmNoPqRsTuVwXyZ 1234567890')).toBe(true);
        expect(rule.validate('1234567890aBcDe F g H i JkLm1234567890NoPq R s T u VwXyZ1234567890')).toBe(true);
    });

    it('should not be working with non alphanumerical characters', () => {
        var rule = new AlphaNumericOrWhitespaceValidationRule();
        expect(rule.validate('van der haegen j@gmail.com')).toBe(false);
        expect(rule.validate('123,1 23')).toBe(false);
        expect(rule.validate('abc !')).toBe(false);
        expect(rule.validate('!@#$ % ^&*()_+')).toBe(false);
    });

    it('should be working with whitespace characters', () => {
        var rule = new AlphaNumericOrWhitespaceValidationRule();
        expect(rule.validate('abc 123')).toBe(true);

        //Note: spaces are always trimmed
        expect(rule.validate(' abc 123 ')).toBe(true);

    });
});