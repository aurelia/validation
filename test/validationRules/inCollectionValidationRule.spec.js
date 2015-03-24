import {InCollectionValidationRule} from '../../src/validation/validationRules';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on InCollectionValidationRule', () => {
    it('should be working with string arrays', () => {
        expect(new InCollectionValidationRule(['a','b']).validate('a')).toBe(true);
        expect(new InCollectionValidationRule(['a','b']).validate('b')).toBe(true);
        expect(new InCollectionValidationRule(['a','b']).validate('c')).toBe(false);
        expect(new InCollectionValidationRule(['a','b']).validate('d')).toBe(false);
    });
    it('should be working with integer', () => {
        expect(new InCollectionValidationRule([1,2]).validate(1)).toBe(true);
        expect(new InCollectionValidationRule([1,2]).validate(1)).toBe(true);
        expect(new InCollectionValidationRule([1,2]).validate(3)).toBe(false);
        expect(new InCollectionValidationRule([1,2]).validate(4)).toBe(false);
    });
    it('should be working with decimals', () => {
        expect(new InCollectionValidationRule([1.1,2.2]).validate(1.1)).toBe(true);
        expect(new InCollectionValidationRule([1.1,2.2]).validate(2.2)).toBe(true);
        expect(new InCollectionValidationRule([1.1,2.2]).validate(2.22)).toBe(false);
        expect(new InCollectionValidationRule([1.1,2.2]).validate(0.93)).toBe(false);
    });
});
