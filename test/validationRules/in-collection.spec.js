import {InCollectionValidationRule} from '../../src/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'isNotEmpty()'

describe('Tests on InCollectionValidationRule', () => {
  it('should be working with string arrays', (done) => {
    var expectations = new Expectations(expect, done);
    expectations.expectAsync(new InCollectionValidationRule(['a', 'b']).validate('a')).toBe(true);
    expectations.expectAsync(new InCollectionValidationRule(['a', 'b']).validate('b')).toBe(true);
    expectations.expectAsync(new InCollectionValidationRule(['a', 'b']).validate('c')).toBe(false);
    expectations.expectAsync(new InCollectionValidationRule(['a', 'b']).validate('d')).toBe(false);
    expectations.validate();
  });
  it('should be working with integer', (done) => {
    var expectations = new Expectations(expect, done);
    expectations.expectAsync(new InCollectionValidationRule([1, 2]).validate(1)).toBe(true);
    expectations.expectAsync(new InCollectionValidationRule([1, 2]).validate(1)).toBe(true);
    expectations.expectAsync(new InCollectionValidationRule([1, 2]).validate(3)).toBe(false);
    expectations.expectAsync(new InCollectionValidationRule([1, 2]).validate(4)).toBe(false);
    expectations.validate();
  });
  it('should be working with decimals', (done) => {
    var expectations = new Expectations(expect, done);
    expectations.expectAsync(new InCollectionValidationRule([1.1, 2.2]).validate(1.1)).toBe(true);
    expectations.expectAsync(new InCollectionValidationRule([1.1, 2.2]).validate(2.2)).toBe(true);
    expectations.expectAsync(new InCollectionValidationRule([1.1, 2.2]).validate(2.22)).toBe(false);
    expectations.expectAsync(new InCollectionValidationRule([1.1, 2.2]).validate(0.93)).toBe(false);
    expectations.validate();
  });
});
