import {Validation} from '../src/validation/validation';
import {ObserverLocator} from 'aurelia-binding';
import {Expectations} from './expectations';

class TestSubject {
  constructor(validation, firstName) {
    this.firstName = firstName;
    this.lastName = 'kinda random';
    this.validation = validation.on(this)
      .ensure('firstName').isNotEmpty().hasMinLength(5) ;
  }

  static createInstance(firstName) {
    var subject = new TestSubject(new Validation(new ObserverLocator()), firstName);
    return subject;
  }
}

describe('Tests on onValidate callbacks', () => {
  it('should call the callback even if the result is not valid', (done) =>{
    var expectations = new Expectations(expect, done);
    var wasCalled = false;
    var subject = TestSubject.createInstance('Bob');
    subject.validation.onValidate( () => {
      wasCalled = true;
      return {};
    });

    expectations.assert(subject.validation.validate(), false);
    expectations.expectAsync(() => { return wasCalled;}).toBe(true);
    expectations.expectAsync(() => { return subject.validation.result.properties.firstName.failingRule;}).toBe('MinimumLengthValidationRule');
    expectations.validate();
  });

  it('should correctly handle the result of the callback if it returns true for a property', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('Bobbette');
    subject.validation.onValidate( () => {
      return {firstName : true }
    });
    expectations.assert(subject.validation.validate(), true);
    expectations.validate();
  });

  it('should correctly handle the result of the callback if it returns a promise that returns true for a property', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('Bobbette');
    subject.validation.onValidate( () => {
      return Promise.resolve({firstName : true });
    });
    expectations.assert(subject.validation.validate(), true);
    expectations.validate();
  });

  it('should correctly handle the result of the callback if it returns null for a property', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('Bobbette');
    subject.validation.onValidate( () => {
      return {firstName : null }
    });
    expectations.assert(subject.validation.validate(), true);
    expectations.validate();
  });

  it('should correctly handle the result of the callback if it returns an empty string for a property', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('Bobbette');
    subject.validation.onValidate( () => {
      return {firstName : '' }
    });
    expectations.assert(subject.validation.validate(), true);
    expectations.validate();
  });



  it('should correctly handle the result of the callback if it returns false for a property', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('Bobbette');
    subject.validation.onValidate( () => {
      return {firstName : false }
    });
    expectations.assert(subject.validation.validate(), false);
    expectations.expectAsync(() => { return subject.validation.result.properties.firstName.message}).toBe('not a valid value');
    expectations.validate();
  });

  it('should not overwrite an already failing property', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('Bob');
    subject.validation.onValidate( () => {
      return {firstName : false }
    });
    expectations.assert(subject.validation.validate(), false);
    expectations.expectAsync(() => { return subject.validation.result.properties.firstName.failingRule;}).toBe('MinimumLengthValidationRule');
    expectations.validate();
  });


  it('should correctly handle the result of the callback if it returns a promise that returns false for a property', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('Bobbette');
    subject.validation.onValidate( () => {
      return Promise.resolve({firstName : false });
    });
    expectations.assert(subject.validation.validate(), false);
    expectations.expectAsync(() => { return subject.validation.result.properties.firstName.message}).toBe('not a valid value');
    expectations.validate();
  });


  it('should correctly handle the result of the callback if it returns a non empty string for a property', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('Bobbette');
    subject.validation.onValidate( () => {
      return {firstName : 'this is not valid' }
    });
    expectations.assert(subject.validation.validate(), false);
    expectations.expectAsync(() => { return subject.validation.result.properties.firstName.message}).toBe('this is not valid');
    expectations.validate();
  });


  it('should call the callback if the result is invalid due to a previous callback', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('Bobbette');
    subject.validation.onValidate( () => {
      return {firstName : false }
    });
    expectations.assert(subject.validation.validate(), false);
    expectations.assert( () => {
      subject.validation.onValidate( () => {return { firstName : true };});
      return subject.validation.validate();
    }, true);
    expectations.validate();
  });

  it('should not have to return values for properties that are now valid', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('Bobbette');
    subject.validation.onValidate( () => {
      return {firstName : false }
    });
    expectations.assert(subject.validation.validate(), false);
    expectations.assert( () => {
      subject.validation.onValidate( () => {return { };});
      return subject.validation.validate();
    }, true);
    expectations.validate();
  });


  it('should not have to return values for properties that are now valid and have no other validation rules', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('Bobbette');
    subject.validation.onValidate( () => {
      return { lastName : false }
    });
    expectations.assert(subject.validation.validate(), false);
    expectations.assert( () => {
      subject.validation.onValidate( () => {return { };});
      return subject.validation.validate();
    }, true);
    expectations.validate();
  });

  it('should have a mechanism to determine rejected promises', (done) => {
    var wasCalled = false;
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('Bobbette');
    subject.validation.onValidate( () => {
      return Promise.reject('something went wrong...');
    }, () => {
        wasCalled = true;
      }
    );
    expectations.assert(subject.validation.validate(), false);
    expectations.expectAsync( () => { return wasCalled; }).toBe(true);
    expectations.validate();
  });
});
