import {EqualityValidationRule} from '../../src/validation/validation-rules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on EqualityValidationRule', () => {
    it('should be working with equality', () => {
        expect(new EqualityValidationRule('a', true).validate('a')).toBe(true);
        expect(new EqualityValidationRule('a', true).validate('b')).toBe(false);

        expect(new EqualityValidationRule(1337, true).validate(1337)).toBe(true);
        expect(new EqualityValidationRule(1337, true).validate(15)).toBe(false);

        expect(new EqualityValidationRule(new Date(2000,1,1,1,1,1), true).validate(new Date(2000,1,1,1,1,1))).toBe(true);
        expect(new EqualityValidationRule(new Date(2000,1,1,1,1,1), true).validate(new Date(2044,1,1,1,1,1))).toBe(false);
    });

    it('should be working with inequality', () => {
        expect(new EqualityValidationRule('a', false).validate('a')).toBe(false);
        expect(new EqualityValidationRule('a', false).validate('b')).toBe(true);

        expect(new EqualityValidationRule(1337, false).validate(1337)).toBe(false);
        expect(new EqualityValidationRule(1337, false).validate(15)).toBe(true);

        expect(new EqualityValidationRule(new Date(2000,1,1,1,1,1), false).validate(new Date(2000,1,1,1,1,1))).toBe(false);
        expect(new EqualityValidationRule(new Date(2000,1,1,1,1,1), false).validate(new Date(2044,1,1,1,1,1))).toBe(true);
    });


    it('should explain with the otherValueLabel, if present', () => {
        var rule = new EqualityValidationRule('a', true);
        rule.validate('b');
        expect(rule.explain().indexOf('password')).toBe(-1);
        //
        rule = new EqualityValidationRule('a', true, 'password');
        rule.validate('b');
        expect(rule.explain().indexOf('password')).not.toBe(-1);
    });
});
