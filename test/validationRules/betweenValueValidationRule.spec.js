import {BetweenValueValidationRule} from '../../src/validation/validationRules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on BetweenValueValidationRule', () => {
    it('should be working with integers', () => {
        var rule = new BetweenValueValidationRule(2,4);
        expect(rule.validate(1)).toBe(false);
        expect(rule.validate(2)).toBe(true);
        expect(rule.validate(3)).toBe(true);
        expect(rule.validate(4)).toBe(false);
    });

    it('should be working with decimals', () => {
        var rule = new BetweenValueValidationRule(2,4);
        expect(rule.validate(1.9)).toBe(false);
        expect(rule.validate(2.0)).toBe(true);
        expect(rule.validate(3.99)).toBe(true);
        expect(rule.validate(4.0)).toBe(false);
    });


    it('should be working with dates', () => {
        var rule = new BetweenValueValidationRule(new Date(2000, 1, 1, 1, 1, 1, 1), new Date(2000, 1, 1, 1, 1, 2, 1) );
        expect(rule.validate(new Date(1999, 1, 1, 1, 1, 1, 1))).toBe(false);
        expect(rule.validate(new Date(2000, 1, 1, 1, 1, 1, 1))).toBe(true);
        expect(rule.validate(new Date(2000, 1, 1, 1, 1, 1, 30))).toBe(true);
        expect(rule.validate(new Date(2000, 1, 1, 1, 1, 2, 1))).toBe(false);
    });
});