import {NumericValidationRule} from '../../src/validation/validation-rules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on NumericValidationRule', () => {
    it('should be working with strings', () => {
        var rule = new NumericValidationRule();
        expect(rule.validate('a')).toBe(false);
        expect(rule.validate('15')).toBe(true);
    });
    it('should be working with simple numbers', () => {
        var rule = new NumericValidationRule();
        expect(rule.validate(3)).toBe(true);
        expect(rule.validate(-3)).toBe(true);
    });
    it('should be working with decimals', () => {
        var rule = new NumericValidationRule();
        expect(rule.validate(3.01)).toBe(true);
        expect(rule.validate(-3.15)).toBe(true);
        expect(rule.validate(-1,234,567.890123)).toBe(true);
    });
    it('should be working with properly formatted numbers', () => {
        var rule = new NumericValidationRule();
        expect(rule.validate('300,000.14')).toBe(true);
        expect(rule.validate('1,234,300,000.14172727')).toBe(true);
        expect(rule.validate('-1,234,300,000.14172727')).toBe(true);
        expect(rule.validate('.12323121')).toBe(true);

        expect(rule.validate('3,12,9')).toBe(false);
        expect(rule.validate('-3,12.2')).toBe(false);
        expect(rule.validate('-3,123.')).toBe(false);
        expect(rule.validate('-3,123.7.7')).toBe(false);
        expect(rule.validate('-0.733,933')).toBe(false);


    });
    it('should be working with unproperly formatted numbers', () => {
        var rule = new NumericValidationRule();
        expect(rule.validate('300000.1419191991')).toBe(true);
    });
});
