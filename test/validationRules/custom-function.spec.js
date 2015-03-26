import {CustomFunctionValidationRule} from '../../src/validation/validation-rules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on CustomFunctionValidationRule', () => {
    it('should be working with simple funtions', () => {
        var rule = new CustomFunctionValidationRule( (newValue, threshold) => { return newValue !== '1337'; });
        expect(rule.validate('1337')).toBe(false);

        var rule = new CustomFunctionValidationRule( (newValue, threshold) => { return newValue === '1337'; });
        expect(rule.validate('1337')).toBe(true);
    });
    it('should be passing the threshold around to the onValidate method', () => {
        var randomObject = { randomProperty : '1337'};
        var rule = new CustomFunctionValidationRule( (newValue, threshold) => { return newValue === threshold.randomProperty; }, randomObject);

        expect(rule.validate('1336')).toBe(false);
        expect(rule.validate('1337')).toBe(true);

        randomObject.randomProperty = '1336';
        expect(rule.validate('1336')).toBe(true);
        expect(rule.validate('1337')).toBe(false);
    });
    it('should be passing the threshold around to the message', () => {
        var randomObject = { randomProperty : '1337'};
        var rule = new CustomFunctionValidationRule( (newValue, threshold) => { return newValue === threshold.randomProperty; }, randomObject);
        rule.withMessage( (newValue, threshold) => { return `Cool ${threshold.randomProperty}`;});

        expect(rule.validate('1336')).toBe(false);
        expect(rule.explain()).toBe('Cool 1337');
    });

});
