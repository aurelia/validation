import {ObserverLocator} from 'aurelia-binding';
import {Validation} from '../src/validation/validation';

class TestSubject {
  constructor(validation){
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
  it('should work on empty, nested properties', () => {
      var subject = TestSubject.createInstance();
      expect(subject.validation.checkAll()).toBe(false);
  });

  it('should bind to nested properties', () => {
      var subject = TestSubject.createInstance();
      subject.company.name = 'Bob the builder construction, inc';
      subject.company.city = 'Bobs town';
      subject.company.email = 'Bob@thebuilder.com';
      subject.company.taps = 5;

      subject.company.email = 'bob.the.builder';
      expect(subject.validation.checkAll()).toBe(false);

      subject.company.email = 'Bob@thebuilder.com';
      expect(subject.validation.checkAll()).toBe(true);

      subject.company = null;
      expect(subject.validation.checkAll()).toBe(false);

  });


    it('should recover when any part of the nested property path changes', () => {
        var subject = TestSubject.createInstance();
        subject.company.name = 'Bob the builder construction, inc';
        subject.company.city = 'Bobs town';
        subject.company.email = 'Bob@thebuilder.com';
        subject.company.taps = 5;


        expect(subject.validation.checkAll()).toBe(true);
        subject.company.email = 'bob.the.builder';

        expect(subject.validation.checkAll()).toBe(false);

        subject.company.email = 'Bob@thebuilder.com';
        expect(subject.validation.checkAll()).toBe(true);

        subject.company = null;
        expect(subject.validation.checkAll()).toBe(false);

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

        expect(subject.validation.checkAll()).toBe(true);
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