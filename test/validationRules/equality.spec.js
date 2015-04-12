import {EqualityValidationRule} from '../../src/validation/validation-rules';
import {EqualityWithOtherLabelValidationRule} from '../../src/validation/validation-rules';
import {InEqualityValidationRule} from '../../src/validation/validation-rules';
import {InEqualityWithOtherLabelValidationRule } from '../../src/validation/validation-rules';

import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'isNotEmpty()'

describe('Tests on EqualityValidationRule', () => {
  it('should be working with equality', (done) => {
    var expectations = new Expectations(expect, done);
    expectations.expectAsync(new EqualityValidationRule('a').validate('a')).toBe(true);
    expectations.expectAsync(new EqualityValidationRule('a').validate('b')).toBe(false);

    expectations.expectAsync(new EqualityValidationRule(1337).validate(1337)).toBe(true);
    expectations.expectAsync(new EqualityValidationRule(1337).validate(15)).toBe(false);

    expectations.expectAsync(new EqualityValidationRule(new Date(2000, 1, 1, 1, 1, 1)).validate(new Date(2000, 1, 1, 1, 1, 1))).toBe(true);
    expectations.expectAsync(new EqualityValidationRule(new Date(2000, 1, 1, 1, 1, 1)).validate(new Date(2044, 1, 1, 1, 1, 1))).toBe(false);
    expectations.validate();
  });

  it('should be working with a function', (done) => {
    var expectations = new Expectations(expect, done);
    expectations.expectAsync(new EqualityValidationRule(() => {return 'a';}).validate('a')).toBe(true);
    expectations.expectAsync(new EqualityValidationRule(() => {return 'a';}).validate('b')).toBe(false);
    expectations.validate();
  });

  it('should be working with inequality', (done) => {
    var expectations = new Expectations(expect, done);
    expectations.expectAsync(new InEqualityValidationRule('a', false).validate('a')).toBe(false);
    expectations.expectAsync(new InEqualityValidationRule('a', false).validate('b')).toBe(true);

    expectations.expectAsync(new InEqualityValidationRule(1337, false).validate(1337)).toBe(false);
    expectations.expectAsync(new InEqualityValidationRule(1337, false).validate(15)).toBe(true);

    expectations.expectAsync(new InEqualityValidationRule(new Date(2000, 1, 1, 1, 1, 1), false).validate(new Date(2000, 1, 1, 1, 1, 1))).toBe(false);
    expectations.expectAsync(new InEqualityValidationRule(new Date(2000, 1, 1, 1, 1, 1), false).validate(new Date(2044, 1, 1, 1, 1, 1))).toBe(true);
    expectations.validate();
  });


  it('should explain with the otherValueLabel, if present', (done) => {
    var expectations = new Expectations(expect, done);
    var ruleEqual = new EqualityValidationRule('a');
    var ruleInEqual = new InEqualityValidationRule('a');
    var ruleEqualWithLabel = new EqualityWithOtherLabelValidationRule('a', 'password');
    var ruleInEqualWithLabel = new InEqualityWithOtherLabelValidationRule('a', 'password');

    expectations.expectAsync(ruleEqual.validate('b')).toBe(false);
    expectations.expectAsync(ruleInEqual.validate('a')).toBe(false);
    expectations.expectAsync(ruleEqualWithLabel.validate('b')).toBe(false);
    expectations.expectAsync(ruleInEqualWithLabel.validate('a')).toBe(false);

    expectations.expectAsync(() => {return ruleEqual.explain();}).toBe('should be a');
    expectations.expectAsync(() => {return ruleInEqual.explain();}).toBe('cannot be a');
    expectations.expectAsync(() => {return ruleEqualWithLabel.explain();}).toBe('does not match password');
    expectations.expectAsync(() => {return ruleInEqualWithLabel.explain();}).toBe('cannot match password');
    expectations.validate();
  });
});
