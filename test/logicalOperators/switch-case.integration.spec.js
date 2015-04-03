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

describe('Integration tests with switch cases', () => {
  it('should work with a simple switch statement', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('John');
    subject.validation
      .ensure('state')
      .notEmpty()
      .switch(() => {
        return subject.country;
      })
      .case('US')
      .in(['TX', 'FL'])
      .case('Belgium')
      .in(['WVL', 'OVL']);

    expectations.assert(() => {
      subject.country = 'US';
      subject.state = 'TX';
      return subject.validation.validate();
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
      subject.state = 'TX';
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      subject.country = 'Germany';
      subject.state = 'TX';
      return subject.validation.validate();
    }, true);

    expectations.validate();

  });

  it('should work with a simple switch statement containing a default', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('John');
    subject.validation
      .ensure('state')
      .notEmpty()
      .switch(() => {
        return subject.country;
      })
      .case('US')
      .in(['TX', 'FL'])
      .case('Belgium')
      .in(['WVL', 'OVL'])
      .default()
      .minLength(3);

    expectations.assert(() => {
      subject.country = 'US';
      subject.state = 'TX';
      return subject.validation.validate();
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
      subject.state = 'TX';
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      subject.country = 'Germany';
      subject.state = 'TX';
      return subject.validation.validate();
    }, false);

    expectations.assert(() => {
      subject.country = 'Germany';
      subject.state = 'WVL';
      return subject.validation.validate();
    }, true);

    expectations.validate();
  });

  it('should work with a simple switch statement containing an endcase',
    (done) => {
      var expectations = new Expectations(expect, done);
      var subject = TestSubject.createInstance('John');
      subject.validation
        .ensure('state')
        .notEmpty()
        .switch(() => {
          return subject.country;
        })
        .case('US')
        .in(['TX', 'FL'])
        .case('Belgium')
        .in(['WVL', 'OVL'])
        .endSwitch()
        .minLength(3);

      expectations.assert(() => {
        subject.country = 'US';
        subject.state = 'TX';
        return subject.validation.validate();
      }, false);

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
      }, false);

      expectations.assert(() => {
        subject.country = 'Germany';
        subject.state = 'WVL';
        return subject.validation.validate();
      }, true);
      expectations.validate();
    });
  it('should allow the switch-expression to be optional', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance('John');
    subject.validation
      .ensure('state')
      .notEmpty()
      .ensure('country')
      .notEmpty()
      .switch()
      .case('US')
      .passes(() => {
        return subject.state === 'TX';
      })
      .case('Belgium')
      .passes(() => {
        return subject.state === 'WVL';
      })
      .endSwitch();

    expectations.assert(() => {
      subject.country = 'US';
      subject.state = 'TX';
      return subject.validation.validate();
    }, true);

    expectations.assert(() => {
      subject.country = 'Belgium';
      subject.state = 'WVL';
      return subject.validation.validate();
    }, true);

    expectations.assert(() => {
      subject.country = 'US';
      subject.state = 'WVL';
      return subject.validation.validate();
    }, false);

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

    expectations.assert(() => {
      subject.country = '';
      subject.state = 'TX';
      return subject.validation.validate();
    }, false);


    expectations.validate();
  });
});
