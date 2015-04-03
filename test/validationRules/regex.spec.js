import {RegexValidationRule} from '../../src/validation/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'notEmpty()'

describe('Tests on RegexValidationRule', () => {

  it('should be working', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new RegexValidationRule(/^\d+$/);
    expectations.expectAsync(rule.validate('a')).toBe(false);
    expectations.expectAsync(rule.validate('15')).toBe(true);
    expectations.validate();
  });
});
