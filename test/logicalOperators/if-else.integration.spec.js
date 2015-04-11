import {ObserverLocator} from 'aurelia-binding';
import {Validation} from '../../src/validation/validation';
import {Expectations} from '../expectations';


class TestSubject {
  constructor(validation, firstName) {
    this.firstName = firstName;
    this.age = 18;
    this.country = 'US';
    this.state = 'TX';
    this.validation = validation.on(this);
  }

  static createInstance(firstName) {
    return new TestSubject(new Validation(new ObserverLocator()), firstName);
  }
}

describe('Integration tests with \'if\' and \'else\'', () => {
  it('should work with a simple if statement', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('John');
    subject.validation
      .ensure('firstName')
      .if(() => {
        return subject.age >= 18;
      })
      .passes((newValue) => {
        return newValue === 'John';
      });

    expectations.assert(() => {
      return subject.validation.validate();
    }, true);

    expectations.assert(() => {
      subject.firstName = 'Bob';
      return subject.validation.validate();
    }, false);

    expectations.validate();
  });

  it('should work with isNotEmpty', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('John');
    subject.validation
      .ensure('firstName')
      .if(() => {
        return subject.age >= 18;
      })
      .isNotEmpty();

    expectations.assert(() => {
      return subject.validation.validate()
    }, true);
    expectations.assert(() => {
      subject.firstName = null;
      return subject.validate();
    }, false);
    expectations.assert(() => {
        subject.age = 15;
        return subject.validate();
      }
      , true);
    expectations.validate();
  });

  it('should work with a simple if and else statement', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('John');
    subject.validation
      .ensure('state')
      .if(() => {
        return subject.country === 'US';
      })
      .isIn(['TX', 'FL'])
      .else()
      .isNotEmpty();

    expectations.assert(()=> {
      return subject.validate();
    }, true);

    expectations.assert(() => {
      subject.country = 'US';
      subject.state = 'WVL';
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      subject.country = 'Belgium';
      subject.state = 'WVL';
      return subject.validation.validate();
    }, true);

    expectations.assert(() => {
      subject.country = 'Belgium';
      subject.state = '';
      return subject.validation.validate();
    }, false);

    expectations.validate();
  });
  it('should work with nested if and else statement', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('John');
    subject.validation
      .ensure('state')
      .if(() => {
        return subject.country === 'US';
      })
      .isIn(['TX', 'FL']) //either 'TX', 'FL' or empty
      .else()
      .if(() => {
        return subject.country === 'Belgium';
      })
      .isIn(['WVL', 'OVL']) //either 'WVL', 'OVL' or empty
      .else()
      .isNotEmpty();
    expectations.assert(() => {
      return subject.validation.validate();
    }, true);
    expectations.assert(() => {
      subject.country = 'US';
      subject.state = 'WVL';
      return subject.validation.validate();
    }, false);
    expectations.assert(() => {
      subject.country = 'US';
      subject.state = '';
      return subject.validation.validate();
    }, true);
    expectations.assert(() => {
      subject.country = 'Belgium';
      subject.state = 'WVL';
      return subject.validation.validate();
    }, true);

    expectations.assert(() => {
      subject.country = 'Belgium';
      subject.state = 'TX';
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      subject.country = 'Germany';
      subject.state = 'TX';
      return subject.validation.validate();
    }, true);

    expectations.assert(() => {
      subject.country = 'Germany';
      subject.state = '';
      return subject.validation.validate();
    }, false);

    expectations.validate();
  });

  it('should work with endIf and else statement', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('John');
    subject.validation
      .ensure('state')
      .if(() => {
        return subject.country === 'US';
      })
      .isIn(['TX', 'FL'])
      .if(() => {
        return subject.state === 'FL'
      })
      .passes(() => {
        return subject.age >= 65;
      })
      .endIf() //without endif, the 'else' would apply if state !== 'FL'
      .else()
      .passes(() => {
        return subject.age >= 18;
      })
      .endIf()
      .isNotEmpty();  //Without the endif, the 'isNotEmpty' would only apply to the above else case

    expectations.assert(() => {
      subject.age = 18;
      subject.country = 'US';
      subject.state = 'TX';
      return subject.validation.validate();
    }, true);


    expectations.assert(() => {
      subject.age = 18;
      subject.country = 'US';
      subject.state = '';
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      subject.age = 18;
      subject.country = 'US';
      subject.state = 'FL';
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      subject.age = 70;
      subject.country = 'US';
      subject.state = 'FL';
      return subject.validation.validate();
    }, true);

    expectations.assert(() => {
      subject.age = 18;
      subject.country = 'Belgium';
      subject.state = 'WVL';
      return subject.validation.validate();
    }, true);

    expectations.assert(() => {
      subject.age = 18;
      subject.country = 'Belgium';
      subject.state = '';
      return subject.validation.validate();
    }, false);

    expectations.validate();
  });
});
