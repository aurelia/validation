import {Validation} from '../src/validation/validation';
import {ObserverLocator} from 'aurelia-binding';
import {Expectations} from './expectations';
import {ValidationConfig} from '../src/validation/validation-config';

class APITest{
  constructor(propertyValue, validation)
  {
    this.propertyValue = propertyValue;
    this.validation = validation.on(this).ensure('propertyValue');
  }
  static Assert( expectations, callback, value, validity )
  {
    var subject = new APITest(value, new Validation(new ObserverLocator()));
    expect(callback(subject.validation)).toBe(subject.validation); //without this, the fluent API would break
    expectations.assert(subject.validation.validate(), validity); //simple check if it also works
    expectations.assert( () => { //and a check if valid has message '', invalid has an actual message
        expect(subject.validation.result.properties.propertyValue.message.length > 1).toBe(!validity);
      return Promise.resolve(true);
    }, true);
  }
}

//Note: tests are kept short for readability. For each rule, there are extensive tests in test/validationRules
describe('Some simple API tests', ()=>{
  it('on containsOnly()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return v.containsOnly(/^[a-z]+$/i);}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.containsOnly(/^[a-z]+$/i);}, '1', false);
    expectations.validate();
  });

  it('on containsOnlyAlpha()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyAlpha();}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyAlpha();}, ' a', false);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyAlpha();}, '1', false);
    expectations.validate();
  });

  it('on containsOnlyAlphaOrWhitespace()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyAlphaOrWhitespace();}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyAlphaOrWhitespace();}, 'a a', true);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyAlphaOrWhitespace();}, '1', false);
    expectations.validate();
  });

  it('on containsOnlyAlphanumericsOrWhitespace()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyAlphanumericsOrWhitespace();}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyAlphanumericsOrWhitespace();}, '1', true);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyAlphanumericsOrWhitespace();}, 'a a', true);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyAlphanumericsOrWhitespace();}, '*', false);
    expectations.validate();
  });

  it('on containsOnlyAlphanumerics()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyAlphanumerics();}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyAlphanumerics();}, '1', true);
    APITest.Assert(expectations, (v) =>{ return  v.containsOnlyAlphanumerics();}, '*', false);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyAlphanumerics();}, 'a ', false);
    expectations.validate();
  });

  it('on containsOnlyDigits()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyDigits();}, 'a', false);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyDigits();}, '1.2', false);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyDigits();}, '1', true);
    expectations.validate();
  });

  it('on containsOnlyLetters()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyLetters();}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyLetters();}, 'a ', false);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyLetters();}, '1', false);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyLetters();}, '*', false);
    expectations.validate();
  });

  it('on containsOnlyLettersOrWhitespace()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyLettersOrWhitespace();}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyLettersOrWhitespace();}, ' ', true);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyLettersOrWhitespace();}, '1', false);
    APITest.Assert(expectations, (v) => { return  v.containsOnlyLettersOrWhitespace();}, '*', false);
    expectations.validate();
  });

  it('on hasLengthBetween()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.hasLengthBetween(2,4);}, 'a', false);
    APITest.Assert(expectations, (v) => { return  v.hasLengthBetween(2,3);}, 'ab', true);
    APITest.Assert(expectations, (v) => { return  v.hasLengthBetween(2,3);}, 'abc', true);
    APITest.Assert(expectations, (v) => { return  v.hasLengthBetween(2,3);}, 'abcd', false);
    expectations.validate();
  });

  it('on hasMinLength()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.hasMinLength(2);}, 'a', false);
    APITest.Assert(expectations, (v) => { return  v.hasMinLength(2);}, 'ab', true);
    expectations.validate();
  });

  it('on hasMaxLength()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.hasMaxLength(1);}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.hasMaxLength(1);}, 'ab', false);
    expectations.validate();
  });

  it('on isBetween()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.isBetween(2,3);}, 1, false);
    APITest.Assert(expectations, (v) => { return  v.isBetween(2,3);}, 2, true);
    APITest.Assert(expectations, (v) => { return  v.isBetween(2,3);}, 3, true);
    APITest.Assert(expectations, (v) => { return  v.isBetween(2,3);}, 4, false);
    expectations.validate();
  });

  it('on isEmail()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.isEmail();}, 'bob@thebuilder.com', true);
    APITest.Assert(expectations, (v) => { return  v.isEmail();}, 'bob', false);
    expectations.validate();
  });

  it('on isEqualTo()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.isEqualTo('a');}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.isEqualTo('a');}, 'b', false);
    expectations.validate();
  });

  it('on isGreaterThan()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.isGreaterThan(2);}, 1, false);
    APITest.Assert(expectations, (v) => { return  v.isGreaterThan(2);}, 2, false);
    APITest.Assert(expectations, (v) => { return  v.isGreaterThan(2);}, 3, true);
    expectations.validate();
  });

  it('on isGreaterThanOrEqualTo()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.isGreaterThanOrEqualTo(2);}, 1, false);
    APITest.Assert(expectations, (v) => { return  v.isGreaterThanOrEqualTo(2);}, 2, true);
    APITest.Assert(expectations, (v) => { return  v.isGreaterThanOrEqualTo(2);}, 3, true);
    expectations.validate();
  });

  it('on isLessThan()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.isLessThan(2);}, 1, true);
    APITest.Assert(expectations, (v) => { return  v.isLessThan(2);}, 2, false);
    APITest.Assert(expectations, (v) => { return  v.isLessThan(2);}, 3, false);
    expectations.validate();
 });

  it('on isLessThanOrEqualTo()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.isLessThanOrEqualTo(2);}, 1, true);
    APITest.Assert(expectations, (v) => { return  v.isLessThanOrEqualTo(2);}, 2, true);
    APITest.Assert(expectations, (v) => { return  v.isLessThanOrEqualTo(2);}, 3, false);
    expectations.validate();
  });

  it('on isIn()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.isIn(['a','b']);}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.isIn(['a','b']);}, 'b', true);
    APITest.Assert(expectations, (v) => { return  v.isIn(['a','b']);}, 'c', false);
    expectations.validate();
  });

  it('on isNotEmpty()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.isNotEmpty();}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.isNotEmpty();}, '', false);
    APITest.Assert(expectations, (v) => { return  v.isNotEmpty();}, null, false);
    expectations.validate();
  });

  it('on isNumber()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.isNumber();}, 'a', false);
    APITest.Assert(expectations, (v) => { return  v.isNumber();}, 1, true);
    APITest.Assert(expectations, (v) => { return  v.isNumber();}, '1', true);
    APITest.Assert(expectations, (v) => { return  v.isNumber();}, '3.14', true);
    expectations.validate();
  });

  it('on isStrongPassword()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.isStrongPassword();}, 'aB*1', true);
    APITest.Assert(expectations, (v) => { return  v.isStrongPassword();}, 'aBcD', false);
    APITest.Assert(expectations, (v) => { return  v.isStrongPassword(2);}, 'aBcD', true);
    expectations.validate();
  });

  it('on isNotEqualTo()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.isNotEqualTo('a');}, 'a', false);
    APITest.Assert(expectations, (v) => { return  v.isNotEqualTo('a');}, 'b', true);
    expectations.validate();
  });


  it('on matches()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.matches(/^\d+$/);}, '1', true);
    APITest.Assert(expectations, (v) => { return  v.matches(/^\d+$/);}, 'b', false);
    expectations.validate();
  });

  it('on passes()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.passes(() => { return true; });}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.passes(() => { return Promise.resolve(true); });}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.passes(() => { return Promise.resolve(false); });}, 'a', false);
    APITest.Assert(expectations, (v) => { return  v.passes(() => { return Promise.resolve('a custom message'); });}, 'a', false);
    APITest.Assert(expectations, (v) => { return  v.passes(() => { return Promise.reject(); });}, 'a', false);
    APITest.Assert(expectations, (v) => { return  v.passes(() => { return false; });}, 'a', false);
    APITest.Assert(expectations, (v) => { return  v.passes(() => { return 'a custom message'; });}, 'a', false);
    expectations.validate();
  });


  it('on withMessage()', (done) => {
    var expectations = new Expectations(expect, done);
    APITest.Assert(expectations, (v) => { return  v.isEqualTo('a').withMessage('a custom message');}, 'a', true);
    APITest.Assert(expectations, (v) => { return  v.isEqualTo('a').withMessage('a custom message');}, 'b', false);
    expectations.validate();
  });
});

describe('Some simple configuration API tests', ()=>{
  it('on computedFrom with a single dependencies', (done) => {
    let subject = { password : 'Abc*12345', confirmPassword : 'Abc*12345' };
    subject.validation = new Validation(new ObserverLocator(), new ValidationConfig()).on(subject)
      .ensure('password').isNotEmpty().hasMinLength(8).isStrongPassword()
      .ensure('confirmPassword', (c) => {c.computedFrom('password')}).isNotEmpty().isEqualTo(() => { return subject.password});

    setTimeout(()=>{
      expect(subject.validation.result.properties.password.isValid).toBe(true);
      expect(subject.validation.result.properties.confirmPassword.isValid).toBe(true);

      subject.password = 'aBc!54321';
      setTimeout(()=>{
        expect(subject.validation.result.properties.password.isValid).toBe(true);
        expect(subject.validation.result.properties.confirmPassword.isValid).toBe(false);
        done();
      },10);
    });
  });
  it('on computedFrom with an array of string dependencies', (done) => {
    let subject = { password : 'Abc*12345', confirmPassword : 'Abc*12345' };
    subject.validation = new Validation(new ObserverLocator(), new ValidationConfig()).on(subject)
      .ensure('password').isNotEmpty().hasMinLength(8).isStrongPassword()
      .ensure('confirmPassword', (c) => {c.computedFrom(['someProperty','password'])}).isNotEmpty().isEqualTo(() => { return subject.password});

    setTimeout(()=>{
      expect(subject.validation.result.properties.password.isValid).toBe(true);
      expect(subject.validation.result.properties.confirmPassword.isValid).toBe(true);

      subject.password = 'aBc!54321';
      setTimeout(()=>{
        expect(subject.validation.result.properties.password.isValid).toBe(true);
        expect(subject.validation.result.properties.confirmPassword.isValid).toBe(false);
        done();
      },10);
    });
  });
});
