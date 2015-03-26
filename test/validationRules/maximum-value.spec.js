import {MaximumValueValidationRule} from '../../src/validation/validation-rules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on MaximumValueValidationRule', () => {
    it('should be working with integers', () => {
        var rule = new MaximumValueValidationRule(3);
        expect(rule.validate(1)).toBe(true);
        expect(rule.validate(2)).toBe(true);
        expect(rule.validate(3)).toBe(false);
        expect(rule.validate(4)).toBe(false);
    });

    it('should be working with decimals', () => {
        var rule = new MaximumValueValidationRule(3);
        expect(rule.validate(2.9)).toBe(true);
        expect(rule.validate(2.99)).toBe(true);
        expect(rule.validate(3.00)).toBe(false);
        expect(rule.validate(3.01)).toBe(false);
    });


    it('should be working with dates', () => {
        var rule = new MaximumValueValidationRule(new Date(2000, 1, 1, 1, 1, 1, 1) );
        expect(rule.validate(new Date(1999, 1, 1, 1, 1, 1, 1))).toBe(true);
        expect(rule.validate(new Date(2000, 1, 1, 1, 1, 1, 0))).toBe(true);
        expect(rule.validate(new Date(2000, 1, 1, 1, 1, 1, 1))).toBe(false);
        expect(rule.validate(new Date(2000, 1, 1, 1, 1, 1, 2))).toBe(false);
    });
});
