import {BetweenLengthValidationRule} from '../../src/validation/validationRules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on BetweenLengthValidationRule', () => {
    it('should be working with strings', () => {
        var rule = new BetweenLengthValidationRule(2,4);
        expect(rule.validate('a')).toBe(false);
        expect(rule.validate('ab')).toBe(true);
        expect(rule.validate('abc')).toBe(true);
        expect(rule.validate('abcd')).toBe(false);
    });

    it('should trim strings before evaluating', () => {
        var rule = new BetweenLengthValidationRule(2,4);
        expect(rule.validate('  a  ')).toBe(false);
        expect(rule.validate('  ab  ')).toBe(true);
        expect(rule.validate('  abc  ')).toBe(true);
        expect(rule.validate('  abcd  ')).toBe(false);
    });
    it('should be working with arrays', () => {
        var rule = new BetweenLengthValidationRule(2,4);
        expect(rule.validate([1])).toBe(false);
        expect(rule.validate([1,2])).toBe(true);
        expect(rule.validate([1,2,3])).toBe(true);
        expect(rule.validate([1,2,3,4])).toBe(false);
    });

    it('should be working with with any object that has a "length" property', () => {
        var rule = new BetweenLengthValidationRule(2,4);
        expect(rule.validate( { length : 1 })).toBe(false);
        expect(rule.validate( { length : 2 })).toBe(true);
        expect(rule.validate( { length : 3 })).toBe(true);
        expect(rule.validate( { length : 4 })).toBe(false);
    });
});
