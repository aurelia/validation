import {ObserverLocator} from 'aurelia-binding';
import {Validation} from '../src/validation/validation';
import {Expectations} from './expectations';

class TestSubject {
  constructor(validation) {
    this.firstName = '';
    this.wealth = '';
    this.validation = validation.on(this)
      .ensure('firstName')
      .isNotEmpty()
      .ensure('wealth')
      .isNotEmpty()
      .isNumber();
  }

  static createInstance() {
    return new TestSubject(new Validation(new ObserverLocator()));
  }
}
describe('I18N tests: messages', () => {
  it('should use a default message (en-US) without loading a locale', (done) => {
    var expectations = new Expectations(expect, done);

    var subject = TestSubject.createInstance(null);
    expectations.assert(() => {
      return subject.validation.validate();
    }, false);
    expectations.assert(() => {
      expect(subject.validation.result.properties.firstName.message).toBe('is required');
      return subject.validation.validate();
    }, false);
    expectations.validate();
  });
  it('should result in properly translated default error message for nl-BE', (done) => {
    var expectations = new Expectations(expect, done);
    Validation.Locale.load('nl-BE').then(()=> {
      var subject = TestSubject.createInstance(null);
      expectations.assert(() => {
        return subject.validation.validate();
      }, false);

      expectations.assert(() => {
        expect(subject.validation.result.properties.firstName.message).toBe('is verplicht');
        Validation.Locale.reset();
        return subject.validation.validate();
      }, false);
      expectations.validate();
    });
  });
  it('should result in properly translated default error message for nl-NL', (done) => {
    var expectations = new Expectations(expect, done);
    Validation.Locale.load('nl-NL').then(()=> {
      var subject = TestSubject.createInstance(null);
      expectations.assert(() => {
        return subject.validation.validate();
      }, false);
      expectations.assert(() => {
        expect(subject.validation.result.properties.firstName.message).toBe('is verplicht');
        Validation.Locale.reset();
        return subject.validation.validate();
      }, false);
      expectations.validate();
    });
  });

  it('should result in properly translated default error message for de-DE', (done) => {
    var expectations = new Expectations(expect, done);
    Validation.Locale.load('de-DE').then(()=> {
      var subject = TestSubject.createInstance(null);
      expectations.assert(() => {
        return subject.validation.validate();
      }, false);
      expectations.assert(() => {
        expect(subject.validation.result.properties.firstName.message).toBe('wird benötigt');
        Validation.Locale.reset();
        return subject.validation.validate();
      }, false);
      expectations.validate();
    });
  });

  it('should result in properly translated default error message for fr-FR', (done) => {
    var expectations = new Expectations(expect, done);
    Validation.Locale.load('fr-FR').then(()=> {
      var subject = TestSubject.createInstance(null);
      expectations.assert(() => {
        return subject.validation.validate();
      }, false);
      expectations.assert(() => {
        expect(subject.validation.result.properties.firstName.message).toBe('est obligatoire');
        Validation.Locale.reset();
        return subject.validation.validate();
      }, false);
      expectations.validate();
    });
  });


  it('should result in properly translated default error message for en-US', (done) => {
    var expectations = new Expectations(expect, done);
    Validation.Locale.load('en-US').then(()=> {
      var subject = TestSubject.createInstance(null);
      expectations.assert(() => {
        return subject.validation.validate();
      }, false);
      expectations.assert(() => {
        expect(subject.validation.result.properties.firstName.message).toBe('is required');
        Validation.Locale.reset();
        return subject.validation.validate();
      }, false);
      expectations.validate();
    });
  });
});

describe('I18N tests: number', () => {
  it('should use a default number format (en-US) without loading a locale', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance(null);
    expectations.assert(() => {
      subject.firstName = 'John';
      subject.wealth = '3,000,000.00';
      return subject.validation.validate();
    }, true);

    expectations.assert(() => {
      subject.wealth = '3.000.000';
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      expect(subject.validation.result.properties.wealth.message).toBe('needs to be a number');
      return subject.validation.validate();
    }, false);

    expectations.validate();
   });
  it('should result in properly translated default error message', (done) => {
    var expectations = new Expectations(expect, done);
    Validation.Locale.load('nl-BE').then(()=> {
      var subject = TestSubject.createInstance(null);
      expectations.assert(() => {
        subject.firstName = 'John';
        subject.wealth = '3000000,00';
        return subject.validation.validate();
      }, true);

      expectations.assert(() => {
        subject.wealth = '3000,000,00';
        return subject.validation.validate();
      }, false);

      expectations.assert(() => {
        expect(subject.validation.result.properties.wealth.message).toBe('moet een getal zijn');
        Validation.Locale.reset();
        return subject.validation.validate();
      }, false);
      expectations.validate();
    });
  });
});
