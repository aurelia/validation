import {ObserverLocator} from 'aurelia-binding';
import {Validation} from '../src/validation/validation';
import {Expectations} from './expectations';
import {ValidationConfig} from '../src/validation/validation-config';

class TestSubject {
  constructor(validation, callback) {
    this.firstName = '';
    this.wealth = '';
    this.validation = validation.on(this, callback)
      .ensure('firstName')
      .isNotEmpty()
      .ensure('wealth')
      .isNotEmpty()
      .isNumber();
  }

  static createInstance(callback) {
    return new TestSubject(new Validation(new ObserverLocator()), callback);
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
    var subject = TestSubject.createInstance((c) => { c.useLocale('nl-BE'); });
    expectations.assert(() => {
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      expect(subject.validation.result.properties.firstName.message).toBe('is verplicht');
      return subject.validation.validate();
    }, false);
    expectations.validate();
  });
  it('should result in properly translated default error message for nl-NL', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance((c) => { c.useLocale('nl-NL'); });
      expectations.assert(() => {
        return subject.validation.validate();
      }, false);
      expectations.assert(() => {
        expect(subject.validation.result.properties.firstName.message).toBe('is verplicht');
        return subject.validation.validate();
      }, false);
      expectations.validate();
  });

  it('can change locale on the fly', (done) => {
    var expectations = new Expectations(expect, done);
    var config = new ValidationConfig();
    var subject = new TestSubject(new Validation(new ObserverLocator(), config));
    expectations.assert(() => {
      return subject.validation.validate();
    }, false);
    expectations.expectAsync(() => { return subject.validation.result.properties.firstName.message;}).toBe('is required');
    expectations.expectAsync(() => { return config.useLocale('nl-BE');}).toBe(config);

    setTimeout(() => {
      expectations.expectAsync(() => {return subject.validation.result.properties.firstName.message;} ).toBe('is verplicht');
      expectations.validate();
    }, 10);
  });

  it('should result in properly translated default error message for de-DE', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance((c) => { c.useLocale('de-DE'); });
    expectations.assert(() => {
      return subject.validation.validate();
    }, false);
    expectations.assert(() => {
      expect(subject.validation.result.properties.firstName.message).toBe('wird benötigt');
      return subject.validation.validate();
    }, false);
    expectations.validate();
  });

  it('should result in properly translated default error message for fr-FR', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance((c) => { c.useLocale('fr-FR'); });
    expectations.assert(() => {
      return subject.validation.validate();
    }, false);
    expectations.assert(() => {
      expect(subject.validation.result.properties.firstName.message).toBe('est obligatoire');
      return subject.validation.validate();
    }, false);
    expectations.validate();
  });


  it('should result in properly translated default error message for es-MX', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance((c) => { c.useLocale('es-MX'); });
    expectations.assert(() => {
      return subject.validation.validate();
    }, false);
    expectations.assert(() => {
      expect(subject.validation.result.properties.firstName.message).toBe('es obligatorio');
      return subject.validation.validate();
    }, false);
    expectations.validate();
  });

  it('should result in properly translated default error message for en-US', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance((c) => { c.useLocale('en-US'); });
    expectations.assert(() => {
      return subject.validation.validate();
    }, false);
    expectations.assert(() => {
      expect(subject.validation.result.properties.firstName.message).toBe('is required');
      return subject.validation.validate();
    }, false);
    expectations.validate();
  });
});

describe('I18N tests: number', () => {
  it('should use a default number format (en-US) without loading a locale', (done) => {
    var expectations = new Expectations(expect, done);
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
  it('should result in properly translated error message', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance((c) => { c.useLocale('nl-BE'); });
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
      return subject.validation.validate();
    }, false);
    expectations.validate();
  });
});
