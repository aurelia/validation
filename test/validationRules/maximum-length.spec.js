import {MaximumLengthValidationRule} from '../../src/validation/validation-rules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on MaximumLengthValidationRule', () => {
    it('should be working with strings', () => {
        var rule = new MaximumLengthValidationRule(3);
        expect(rule.validate('a')).toBe(true);
        expect(rule.validate('ab')).toBe(true);
        expect(rule.validate('abc')).toBe(false);
        expect(rule.validate('abcd')).toBe(false);
    });

    it('should trim strings before evaluating', () => {
        var rule = new MaximumLengthValidationRule(3);
        expect(rule.validate('  a  ')).toBe(true);
        expect(rule.validate('  ab  ')).toBe(true);
        expect(rule.validate('  abc  ')).toBe(false);
        expect(rule.validate('  abcd  ')).toBe(false);
    });
    it('should be working with arrays', () => {
        var rule = new MaximumLengthValidationRule(3);
        expect(rule.validate([1])).toBe(true);
        expect(rule.validate([1,2])).toBe(true);
        expect(rule.validate([1,2,3])).toBe(false);
        expect(rule.validate([1,2,3,4])).toBe(false);
    });

    it('should be working with with any object that has a "length" property', () => {
        var rule = new MaximumLengthValidationRule(3);
        expect(rule.validate( { length : 1 })).toBe(true);
        expect(rule.validate( { length : 2 })).toBe(true);
        expect(rule.validate( { length : 3 })).toBe(false);
        expect(rule.validate( { length : 4 })).toBe(false);
    });
});
