import {StrongPasswordValidationRule} from '../../src/validation/validation-rules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on StrongPasswordValidationRule', () => {
    it('should be working with strong passwords', () => {
        var rule = new StrongPasswordValidationRule();
        expect(rule.validate('aBcdE*123')).toBe(true);
    });

    it('should respect the minimum complexity level', () => {
        var rule = new StrongPasswordValidationRule(); //default complexity level is 4
        expect(rule.validate('aBcdEfG*1')).toBe(true);
        expect(rule.validate('aBcdEfG*')).toBe(false);
        expect(rule.validate('aBcdEfG1')).toBe(false);
        expect(rule.validate('abcdefg*1')).toBe(false);
        expect(rule.validate('ABCDEFG*1')).toBe(false);

        rule = new StrongPasswordValidationRule(3); //allows 'medium' passwords
        expect(rule.validate('aBcdEfG*1')).toBe(true);
        expect(rule.validate('aBcdEfG*')).toBe(true);
        expect(rule.validate('aBcdEfG1')).toBe(true);
        expect(rule.validate('abcdefg*1')).toBe(true);
        expect(rule.validate('ABCDEFG*1')).toBe(true);
        expect(rule.validate('ABCDEFG123')).toBe(false);
        expect(rule.validate('123abcdefg')).toBe(false);
    });
});
