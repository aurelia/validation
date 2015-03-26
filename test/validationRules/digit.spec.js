import {DigitValidationRule} from '../../src/validation/validation-rules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on DigitValidationRule', () => {
    it('should be working with strings', () => {
        var rule = new DigitValidationRule();
        expect(rule.validate('a')).toBe(false);
        expect(rule.validate('15')).toBe(true);
    });
    it('should be working with simple numbers', () => {
        var rule = new DigitValidationRule();
        expect(rule.validate(3)).toBe(true);
        expect(rule.validate(-3)).toBe(false);
    });
    it('should not be working with decimals', () => {
        var rule = new DigitValidationRule();
        expect(rule.validate(3.01)).toBe(false);
    });
    it('should not be working with properly formatted numbers', () => {
        var rule = new DigitValidationRule();
        expect(rule.validate('300,000.14')).toBe(false);
    });
});
