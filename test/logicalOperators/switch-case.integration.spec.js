import {ObserverLocator} from 'aurelia-binding';
import {Validation} from '../../src/validation/validation';


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
    it('should work with a simple switch statement', () => {
        var subject = TestSubject.createInstance('John');
        subject.validation
            .ensure('state')
            .notEmpty()
            .switch(() => {return subject.country;})
                .case('US')
                    .in(['TX','FL'])
                .case('Belgium')
                    .in(['WVL', 'OVL']);

        subject.country = 'US';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(true);

        subject.country = 'US';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(false);


        subject.country = 'Belgium';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(true);

        subject.country = 'Belgium';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(false);

        subject.country = 'Germany';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(true);
    });

    it('should work with a simple switch statement containing a default', () => {
        var subject = TestSubject.createInstance('John');
        subject.validation
            .ensure('state')
            .notEmpty()
            .switch(() => {return subject.country;})
                .case('US')
                    .in(['TX','FL'])
                .case('Belgium')
                    .in(['WVL', 'OVL'])
                .default()
                    .minLength(3);

        subject.country = 'US';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(true);

        subject.country = 'US';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(false);


        subject.country = 'Belgium';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(true);

        subject.country = 'Belgium';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(false);

        subject.country = 'Germany';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(false);

        subject.country = 'Germany';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(true);
    });

    it('should work with a simple switch statement containing an endcase', () => {
        var subject = TestSubject.createInstance('John');
        subject.validation
            .ensure('state')
                .notEmpty()
                .switch(() => {return subject.country;})
                    .case('US')
                        .in(['TX','FL'])
                    .case('Belgium')
                        .in(['WVL', 'OVL'])
                .endSwitch()
                .minLength(3);

        subject.country = 'US';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(false);

        subject.country = 'Belgium';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(true);

        subject.country = 'Belgium';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(false);

        subject.country = 'Germany';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(false);

        subject.country = 'Germany';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(true);
    });
    it('should allow the switch-expression to be optional', () => {
        //When
        var subject = TestSubject.createInstance('John');
        subject.validation
            .ensure('state')
                .notEmpty()
            .ensure('country')
                .notEmpty()
                .switch()
                    .case('US')
                        .passes( () => { return subject.state === 'TX'; })
                    .case('Belgium')
                        .passes( () => { return subject.state === 'WVL'; })
                .endSwitch();

        subject.country = 'US';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(true);

        subject.country = 'Belgium';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(true);

        subject.country = 'US';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(false);

        subject.country = 'Belgium';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(false);


        subject.country = 'Germany';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(true);


        subject.country = 'Germany';
        subject.state = '';
        expect(subject.validation.checkAll()).toBe(false);

        subject.country = '';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(false);
    });
});