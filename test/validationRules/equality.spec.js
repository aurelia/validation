import {EqualityValidationRule} from '../../src/validation/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on EqualityValidationRule', () => {
  it('should be working with equality', (done) => {
    var expectations = new Expectations(expect, done);
    expectations.expectAsync(new EqualityValidationRule('a', true).validate('a')).toBe(true);
    expectations.expectAsync(new EqualityValidationRule('a', true).validate('b')).toBe(false);

    expectations.expectAsync(new EqualityValidationRule(1337, true).validate(1337)).toBe(true);
    expectations.expectAsync(new EqualityValidationRule(1337, true).validate(15)).toBe(false);

    expectations.expectAsync(new EqualityValidationRule(new Date(2000, 1, 1, 1, 1, 1), true).validate(new Date(2000, 1, 1, 1, 1, 1))).toBe(true);
    expectations.expectAsync(new EqualityValidationRule(new Date(2000, 1, 1, 1, 1, 1), true).validate(new Date(2044, 1, 1, 1, 1, 1))).toBe(false);
    expectations.validate();
  });

  it('should be working with inequality', (done) => {
    var expectations = new Expectations(expect, done);
    expectations.expectAsync(new EqualityValidationRule('a', false).validate('a')).toBe(false);
    expectations.expectAsync(new EqualityValidationRule('a', false).validate('b')).toBe(true);

    expectations.expectAsync(new EqualityValidationRule(1337, false).validate(1337)).toBe(false);
    expectations.expectAsync(new EqualityValidationRule(1337, false).validate(15)).toBe(true);

    expectations.expectAsync(new EqualityValidationRule(new Date(2000, 1, 1, 1, 1, 1), false).validate(new Date(2000, 1, 1, 1, 1, 1))).toBe(false);
    expectations.expectAsync(new EqualityValidationRule(new Date(2000, 1, 1, 1, 1, 1), false).validate(new Date(2044, 1, 1, 1, 1, 1))).toBe(true);
    expectations.validate();
  });


  it('should explain with the otherValueLabel, if present', (done) => {
    var rule = new EqualityValidationRule('a', true);
    //
    rule.validate('b').then(
      () => {
        expect(rule.explain().indexOf('password')).toBe(-1);
        done();
      },
      (a) => {
        expect(rule.explain().indexOf('password')).toBe(-1);
        rule = new EqualityValidationRule('a', true, 'password');
        rule.validate('b').then(
          (b) => {
            expect(rule.explain().indexOf('password')).not.toBe(-1);
            done();
          }, (b) => {
            expect(rule.explain().indexOf('password')).not.toBe(-1)
            done();
          });

      }
    );
  });
});
