import {ObserverLocator} from 'aurelia-binding';
import {Validation} from '../src/validation/validation';
import {Expectations} from './expectations';

Validation.debounceTime = 1;

class TestSubject {
  constructor(validation, firstName) {
    this.firstName = firstName;
    this.validation = validation.on(this)
      .ensure('firstName')
      .notEmpty();
  }

  static createInstance(firstName) {
    return new TestSubject(new Validation(new ObserverLocator()), firstName);
  }
}

describe('Basic validation tests', () => {
  it('should fail if a notempty property is null', (done) => {
    var subject = TestSubject.createInstance(null);
    setTimeout(()=> {
      expect(subject.validation.result.isValid).toBe(false);
      done();
    }, 0);
  });


  it('should fail if a notempty property is an empty string', (done) => {
    var subject = TestSubject.createInstance('');
    setTimeout(()=> {
      expect(subject.validation.result.isValid).toBe(false);
      done();
    }, 0);
  });


  it('should fail if a notempty property contains only whitespace', (done) => {
    var subject = TestSubject.createInstance('            ');
    setTimeout(()=> {
      expect(subject.validation.result.isValid).toBe(false);
      done();
    }, 0);
  });


  it('should not fail if a notempty property is a random string', (done) => {
    var subject = TestSubject.createInstance('a random string');
    setTimeout(()=> {
      expect(subject.validation.result.isValid).toBe(true);
      done();
    }, 0);
  });


  it('should fail if an array is empty', (done) => {
    var subject = TestSubject.createInstance([]);
    setTimeout(()=> {
      expect(subject.validation.result.isValid).toBe(false);
      done();
    }, 0);
  });


  it('should not fail on an array with elements', (done) => {
    var subject = TestSubject.createInstance(['some element']);
    setTimeout(()=> {
      expect(subject.validation.result.isValid).toBe(true);
      done();
    }, 0);
  });


  it('should not fail on an array with empty element', (done) => {
    var subject = TestSubject.createInstance(['']);
    setTimeout(()=> {
      expect(subject.validation.result.isValid).toBe(true);
      done();
    }, 0);
  });


  it('should not fail if value is a function', (done) => {
    var subject = TestSubject.createInstance(() => {
      return 'Demo';
    });
    setTimeout(()=> {
      expect(subject.validation.result.isValid).toBe(true);
      done();
    }, 0);
  });

  it('should evaluate immediately without marking the property as dirty', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = {firstName: 'John'};

    subject.validation = new Validation(new ObserverLocator()).on(subject)
      .ensure('firstName').notEmpty().betweenLength(5, 10);

    setTimeout(() => {
      expect(subject.validation.result.isValid).toBe(false);
      expect(subject.validation.result.properties.firstName.isDirty).toBe(false);
      expectations.assert(() => {
        return subject.validation.validate();
      }, false);

      expectations.assert(() => {
        expect(subject.validation.result.isValid).toBe(false);
        expect(subject.validation.result.properties.firstName.isDirty).toBe(true);
        return Promise.resolve(true);
      }, true);

      expectations.validate();
    }, 0);
  });


  it('should update the validation automatically when the property changes with nested properties', (done) => {
    var subject = {company: {name: 'Bob the builder construction, Inc.'}};

    subject.validation = new Validation(new ObserverLocator()).on(subject)
      .ensure('company.name')
      .notEmpty().betweenLength(5, 10);
    setTimeout(() => { //Settimeout to allow initial validation
      expect(subject.validation.result.isValid).toBe(false);

      subject.company.name = 'Bob, Inc.';
      setTimeout(()=> { //wait 200 ms to allow validation on the new value
        expect(subject.validation.result.isValid).toBe(true);
        done();
      },  50);
      //Note: cannot really use jasmine.clock() because of the combination of setTimeout and actual promises
    }, 0);
  });


  it('should update the validation automatically when the property changes', (done) => {
    var subject = TestSubject.createInstance(null);

    setTimeout(() => {
      expect(subject.validation.result.isValid).toBe(false);
      subject.firstName = 'Bob the builder';
      setTimeout(() =>{
        expect(subject.validation.result.isValid).toBe(true);
        done();

      }, 50);
      //Note: cannot really use jasmine.clock() because of the combination of setTimeout and actual promises
    }, 0);
  });


  it('should not update if the value continuously changes', (done) => {
    var subject = TestSubject.createInstance(null);
    subject.validation.ensure('firstName').notEmpty().betweenLength(5, 10);

    setTimeout(() => { //Do setTimout 0 to allow initial validation
      expect(subject.validation.result.isValid).toBe(false);

      subject.firstName = 'Bob';
      setTimeout(() =>{ //Do setTimout 190, property should not be validated
        expect(subject.validation.result.isValid).toBe(false);

        subject.firstName = 'Bobby';
        setTimeout( () => { //Property changed before 200 ms, property should not be validated
          expect(subject.validation.result.isValid).toBe(false);
          setTimeout(() => { //property did not change in last 200 ms, property should be validated
            expect(subject.validation.result.isValid).toBe(true);
            done();
          }, 21);
        }, Validation.debounceTime - 10);
      }, Validation.debounceTime - 10);
    }, 0);
  });


  it('should update the validation when validate() is called', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance(null);
    setTimeout(() => {
      expect(subject.validation.result.isValid).toBe(false);
      expectations.assert(() => {
        subject.firstName = 'Bob the builder';
        return subject.validation.validate();
      }, true);
      expectations.validate();
    }, 0);
  });


  it('should update if an array gains elements', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance([]);
    setTimeout(()=> {
      expect(subject.validation.result.isValid).toBe(false);
      expectations.assert(() => {
        subject.firstName.push('bob the builder');
        return subject.validation.validate();
      }, true);

      expectations.assert(() => {
        subject.firstName.pop();
        return subject.validation.validate();
      }, false);

      expectations.validate();
    }, 0);
  });


  it('should update if an array is overwritten', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance(['a', 'b', 'c']);
    expect(subject.validation.result.isValid).toBe(true);
    expectations.assert(() => {
      subject.firstName = [];
      return subject.validation.validate();
    }, false);
    expectations.validate();
  });

  it('should use a custom message if one is provided', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance("Bob");
    subject.validation.ensure('firstName').minLength(10).withMessage("Not valid!");

    expectations.assert(() => {
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      expect(subject.validation.result.properties.firstName.message).toBe("Not valid!");
      return subject.validation.validate();
    }, false);

    expectations.validate();
  });
  it('should use a custom message function if one is provided', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance("Bob");
    subject.validation.ensure('firstName').minLength(10).withMessage((newValue, threshold) => {
      return newValue + " is not valid!";
    });

    expectations.assert(() => {
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      expect(subject.validation.result.properties.firstName.message).toBe("Bob is not valid!");
      return subject.validation.validate();
    }, false);

    expectations.validate();
  });


  it('should complete when validation is valid', (done) => {
    var subject = TestSubject.createInstance("Bob");

    subject.validation.validate().then(() => {
      expect('validate() should complete').toBe('validate() should complete');
      done();
    }, () => {
      expect('validate() should complete').toBe('validate() rejected');
      done();
    });
  });
  it('should reject when validation is invalid', (done) => {
    var subject = TestSubject.createInstance('');

    subject.validation.validate().then(() => {
      expect('validate() should reject').toBe('validate() completed');
      done();
    }, () => {
      expect('validate() should reject').toBe('validate() should reject');
      done();
    });
  });
});
