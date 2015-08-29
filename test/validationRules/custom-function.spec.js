import {CustomFunctionValidationRule} from '../../src/validation-rules';
import {Expectations} from '../expectations';

//No need to test empty values, they are filtered out by the "ValidationProperty" depending if they are 'isNotEmpty()'

describe('Tests on CustomFunctionValidationRule', () => {


  it('should be working with simple funtions', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => {
      return newValue !== '1337';
    });
    expectations.expectAsync(rule.validate('1337')).toBe(false);

    var rule = new CustomFunctionValidationRule((newValue, threshold) => {
      return newValue === '1337';
    });
    expectations.expectAsync(rule.validate('1337')).toBe(true);
    expectations.validate();
  });
  it('should be passing the threshold around to the onValidate method', (done) => {
    var expectations = new Expectations(expect, done);
    var randomObject = {randomProperty: '1337'};
    var rule = new CustomFunctionValidationRule((newValue, threshold) => {
      return newValue === threshold.randomProperty;
    }, randomObject);

    expectations.expectAsync(rule.validate('1336')).toBe(false);
    expectations.expectAsync(rule.validate('1337')).toBe(true);

    randomObject.randomProperty = '1336';
    expectations.expectAsync(rule.validate('1336')).toBe(true);
    expectations.expectAsync(rule.validate('1337')).toBe(false);
    expectations.validate();
  });

  it('should be passing the threshold around to the message', (done) => {
    var expectations = new Expectations(expect, done);
    var randomObject = {randomProperty: '1337'};
    var rule = new CustomFunctionValidationRule((newValue, threshold) => {
      return newValue === threshold.randomProperty;
    }, randomObject);
    rule.withMessage((newValue, threshold) => {
      return `Cool ${threshold.randomProperty}`;
    });

    expectations.expectAsync(rule.validate('1336')).toBe(false);
    expectations.expectAsync( () => { return rule.explain();}).toBe('Cool 1337');
    expectations.validate();
  });

  it('should succeed when the function returns true', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return true ; });
    expectations.expectAsync(rule.validate('')).toBe(true);
    expectations.validate();
  });

  it('should succeed when the function returns null', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return null ; });
    expectations.expectAsync(rule.validate('')).toBe(true);
    expectations.validate();
  });

  it('should succeed when the function returns undefined', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return undefined ; });
    expectations.expectAsync(rule.validate('')).toBe(true);
    expectations.validate();
  });

  it('should succeed when the function returns an empty string', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return '' ; });
    expectations.expectAsync(rule.validate('')).toBe(true);
    expectations.validate();
  });

  it('should fail when the function returns false', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return false ; });
    expectations.expectAsync(rule.validate('')).toBe(false);
    expectations.validate();
  });

  it('should fail when the function returns a message', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return 'this is not good' ; });
    expectations.expectAsync(rule.validate('')).toBe(false);
    expectations.assert( () => {
      expect(rule.explain()).toBe('this is not good');
      return Promise.resolve(true);
    }, true);
    expectations.validate();
  });


  it('should succeed when the function returns a promise that resolves to true', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return Promise.resolve(true) ; });
    expectations.expectAsync(rule.validate('')).toBe(true);
    expectations.validate();
  });

  it('should succeed when the function returns a promise that resolves to null', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return Promise.resolve(null) ; });
    expectations.expectAsync(rule.validate('')).toBe(true);
    expectations.validate();
  });

  it('should succeed when the function returns a promise that resolves to undefined', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return Promise.resolve(undefined) ; });
    expectations.expectAsync(rule.validate('')).toBe(true);
    expectations.validate();
  });

  it('should succeed when the function returns a promise that resolves to  an empty string', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return Promise.resolve('') ; });
    expectations.expectAsync(rule.validate('')).toBe(true);
    expectations.validate();
  });

  it('should fail when the function returns a promise that resolves to  false', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return Promise.resolve(false) ; });
    expectations.expectAsync(rule.validate('')).toBe(false);
    expectations.validate();
  });

  it('should fail when the function returns  a promise that resolves to a message', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return Promise.resolve('this is not good') ; });
    expectations.expectAsync(rule.validate('')).toBe(false);
    expectations.expectAsync( () => { return rule.explain();}).toBe('this is not good');
    expectations.validate();
  });

  it('should fail when the function returns  a promise that rejects', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return Promise.reject() ; });
    expectations.expectAsync(rule.validate('')).toBe(false);
    expectations.validate();
  });

  it('should fail when the function returns  a promise that rejects to a true', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return Promise.reject(true); });
    expectations.expectAsync(rule.validate('')).toBe(false);
    expectations.validate();
  });

  it('should fail when the function returns  a promise that rejects to a undefined', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return Promise.reject( undefined); });
    expectations.expectAsync(rule.validate('')).toBe(false);
    expectations.validate();
  });
  it('should fail when the function returns  a promise that rejects to a null', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return Promise.reject( null) ; });
    expectations.expectAsync(rule.validate('')).toBe(false);
    expectations.validate();
  });
  it('should fail when the function returns  a promise that rejects to a message', (done) => {
    var expectations = new Expectations(expect, done);
    var rule = new CustomFunctionValidationRule((newValue, threshold) => { return Promise.reject('this is not good') ; });
    expectations.expectAsync(rule.validate('')).toBe(false);
    expectations.expectAsync( () => { return rule.explain(); }).toBe('this is not good');
    expectations.validate();
  });
});
