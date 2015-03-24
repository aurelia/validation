import {MinimumLengthValidationRule} from '../../src/validation/validationRules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on MinimumLengthValidationRule', () => {
    it('should be working with strings', () => {
        var rule = new MinimumLengthValidationRule(3);
        expect(rule.validate('a')).toBe(false);
        expect(rule.validate('ab')).toBe(false);
        expect(rule.validate('abc')).toBe(true);
        expect(rule.validate('abcd')).toBe(true);
    });

    it('should trim strings before evaluating', () => {
        var rule = new MinimumLengthValidationRule(3);
        expect(rule.validate('  a  ')).toBe(false);
        expect(rule.validate('  ab  ')).toBe(false);
        expect(rule.validate('  abc  ')).toBe(true);
        expect(rule.validate('  abcd  ')).toBe(true);
    });
    it('should be working with arrays', () => {
        var rule = new MinimumLengthValidationRule(3);
        expect(rule.validate([1])).toBe(false);
        expect(rule.validate([1,2])).toBe(false);
        expect(rule.validate([1,2,3])).toBe(true);
        expect(rule.validate([1,2,3,4])).toBe(true);
    });

    it('should be working with with any object that has a "length" property', () => {
        var rule = new MinimumLengthValidationRule(3);
        expect(rule.validate( { length : 1 })).toBe(false);
        expect(rule.validate( { length : 2 })).toBe(false);
        expect(rule.validate( { length : 3 })).toBe(true);
        expect(rule.validate( { length : 4 })).toBe(true);
    });
});