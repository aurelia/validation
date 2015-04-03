import {ObserverLocator} from 'aurelia-binding';
import {Validation} from '../src/validation/validation';
import {Expectations} from './expectations';

class TestSubject {
  constructor(validation) {
    this.company = {
      name: '',
      city: '',
      email: '',
      taps: 0
    };
    this.validation = validation.on(this)
      .ensure('company.name').notEmpty()
      .ensure('company.city').notEmpty()
      .ensure('company.email').notEmpty().email()
      .ensure('company.taps').isNumeric().minimum(1).maximum(500);
  }

  static createInstance() {
    return new TestSubject(new Validation(new ObserverLocator()));
  }
}

describe('Nested property tests', () => {
  it('should work on empty, nested properties', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance();
    expectations.assert(() => {
      return subject.validation.validate();
    }, false);
    expectations.validate();
  });

  it('should bind to nested properties', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance();


    expectations.assert(() => {
      subject.company.name = 'Bob the builder construction, inc';
      subject.company.city = 'Bobs town';
      subject.company.email = 'Bob@thebuilder.com';
      subject.company.taps = 5;
      return subject.validation.validate();
    }, true);

    expectations.assert(() => {
      subject.company.email = 'bob.the.builder';
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      subject.company.email = 'Bob@thebuilder.com';
      return subject.validation.validate();
    }, true);

    expectations.assert(() => {
      subject.company = null;
      return subject.validation.validate();
    }, false);
    expectations.validate();

  });


  it('should recover when any part of the nested property path changes', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance();
    expectations.assert(() => {
      subject.company.name = 'Bob the builder construction, inc';
      subject.company.city = 'Bobs town';
      subject.company.email = 'Bob@thebuilder.com';
      subject.company.taps = 5;
      return subject.validation.validate();
    }, true);

    expectations.assert(() => {
      subject.company.email = 'bob.the.builder';
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      subject.company.email = 'Bob@thebuilder.com';
      return subject.validation.validate();
    }, true);

    expectations.assert(() => {
      subject.company = null;
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      subject.company = {
        name: '',
        city: '',
        email: '',
        taps: 0
      };

      subject.company.name = 'Bob the builder construction, inc';
      subject.company.city = 'Bobs town';
      subject.company.email = 'Bob@thebuilder.com';
      subject.company.taps = 5;

      return subject.validation.validate();
    }, true);

    expectations.validate();
  });
  it('should exist only if the observer-locator cannot handle nested paths ', () => {
    var subject = TestSubject.createInstance();
    subject.company.email = 'Bob@thebuilder.com';

    var observer = new ObserverLocator()
      .getObserver(subject, 'company.email');

    expect(observer.getValue()).toBe(undefined);
    //If this returns "expected Bob@thebuilder.com to be undefined", the custom pathObserver implementation can go :)

  });

});
