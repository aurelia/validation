import {Validation} from '../src/validation';
import {ObserverLocator} from 'aurelia-binding';
import {Expectations} from './expectations';
import {ValidationConfig} from '../src/validation-config';

class TestSubject {
  constructor(validation, firstName) {
    this.firstName = firstName;
    this.validation = validation.on(this);
  }

  static createInstance(firstName, config) {
    var subject = new TestSubject(new Validation(new ObserverLocator(), config), firstName);
    subject.validation
      .ensure('firstName')
      .isNotEmpty();
    return subject;
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
      .ensure('firstName').isNotEmpty().hasLengthBetween(5, 10);

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
      .isNotEmpty().hasLengthBetween(5, 10);
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


  it('should not update if the value continuously changes and a debounce time is set on the validation', (done) => {
    var subject = TestSubject.createInstance(null, new ValidationConfig().useDebounceTimeout(50));
    subject.validation.ensure('firstName').isNotEmpty().hasLengthBetween(5, 10);

    setTimeout(() => { //Do setTimout 0 to allow initial validation
      expect(subject.validation.result.isValid).toBe(false);

      subject.firstName = 'Bob';
      setTimeout(() =>{ //Do setTimout 190, property should not be validated
        expect(subject.validation.result.isValid).toBe(false);

        subject.firstName = 'Bobby';
        setTimeout( () => { //Property changed before x ms, property should not be validated
          expect(subject.validation.result.isValid).toBe(false);
          setTimeout(() => { //property did not change in last x ms, property should be validated
            expect(subject.validation.result.isValid).toBe(true);
            done();
          }, 21);
        }, 40);
      }, 40);
    }, 0);
  });

  it('should not update if the value continuously changes and a debounce time is set on the property', (done) => {
    var subject = new TestSubject(new Validation(new ObserverLocator(), new ValidationConfig()), null);
    subject.validation.ensure('firstName', (config) => {config.useDebounceTimeout(50)}).isNotEmpty().hasLengthBetween(5, 10);

    setTimeout(() => { //Do setTimout 0 to allow initial validation
      expect(subject.validation.result.isValid).toBe(false);

      subject.firstName = 'Bob';
      setTimeout(() =>{ //Do setTimout 190, property should not be validated
        expect(subject.validation.result.isValid).toBe(false);

        subject.firstName = 'Bobby';
        setTimeout( () => { //Property changed before x ms, property should not be validated
          expect(subject.validation.result.isValid).toBe(false);
          setTimeout(() => { //property did not change in last x ms, property should be validated
            expect(subject.validation.result.isValid).toBe(true);
            done();
          }, 21);
        }, 40);
      }, 40);
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
    subject.validation.ensure('firstName').hasMinLength(10).withMessage("Not valid!");

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
    subject.validation.ensure('firstName').hasMinLength(10).withMessage((newValue, threshold) => {
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


  it('should set isValidating when validating', (done) => {
    var subject = TestSubject.createInstance('Bob');

    expect(subject.validation.isValidating).toBe(false);
    var validation =     subject.validation.validate();
    expect(subject.validation.isValidating).toBe(true);

    validation.then(() => {
      expect(subject.validation.isValidating).toBe(false);
      done();
    });
  });

  it('should only set the result based on the latest value', (done) => {
    var subject = new TestSubject(new Validation(new ObserverLocator()), '');
    subject.validation.ensure('firstName').passes( () => { return new Promise((fulfil) => {
      setTimeout(()=>{
        fulfil(false);
      }, 10);
    })});
    subject.firstName = 'Bob';
    //Trigger validation on 'Bob', it will fail in 10 ms.
    subject.validation.validate().then( ()=> {}, ()=> {});
    setTimeout( () => {
      subject.firstName = ''; //Meanwhile, set firstName to ''. This is a valid value
      setTimeout(()=> {
        //Check that the result from the delayed validation on 'Bob' does not overwrite the reesult of ''.
        expect(subject.validation.result.properties.firstName.isValid).toBe(true);
        expect(subject.validation.result.properties.firstName.message).toBe('');
        done();
      }, 10);
    }, 5);
  });
});
