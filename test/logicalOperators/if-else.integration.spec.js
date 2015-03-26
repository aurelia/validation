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

describe('Integration tests with \'if\' and \'else\'', () => {
    it('should work with a simple if statement', () => {
        var subject = TestSubject.createInstance('John');
        subject.validation
            .ensure('firstName')
            .if(() => { return subject.age >= 18; })
                .passes((newValue) => { return newValue === 'John'; });


        expect(subject.validation.checkAll()).toBe(true);

        subject.firstName = 'Bob';
        expect(subject.validation.checkAll()).toBe(false);
    });
    it('should work with notEmpty', () => {
        var subject = TestSubject.createInstance('John');
        subject.validation
            .ensure('firstName')
            .if(() => { return subject.age >= 18; })
                .notEmpty();

        expect(subject.validation.checkAll()).toBe(true);

        subject.firstName = null;
        expect(subject.validation.checkAll()).toBe(false);

        subject.age = 15;
        expect(subject.validation.checkAll()).toBe(true);
    });

    it('should work with a simple if and else statement', () => {
        var subject = TestSubject.createInstance('John');
        subject.validation
            .ensure('state')
            .if(() => { return subject.country === 'US'; })
                .in(['TX', 'FL'])
            .else()
                .notEmpty();

        expect(subject.validation.checkAll()).toBe(true);

        subject.country = 'US';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(false);

        subject.country = 'Belgium';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(true);

        subject.country = 'Belgium';
        subject.state = '';
        expect(subject.validation.checkAll()).toBe(false);
    });
    it('should work with nested if and else statement', () => {
        var subject = TestSubject.createInstance('John');
        subject.validation
            .ensure('state')
            .if(() => { return subject.country === 'US'; })
                .in(['TX', 'FL']) //either 'TX', 'FL' or empty
            .else()
                .if(() => { return subject.country === 'Belgium'; })
                    .in(['WVL', 'OVL']) //either 'WVL', 'OVL' or empty
                .else()
                    .notEmpty();

        expect(subject.validation.checkAll()).toBe(true);

        subject.country = 'US';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(false);

        subject.country = 'US';
        subject.state = '';
        expect(subject.validation.checkAll()).toBe(true);

        subject.country = 'Belgium';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(true);

        subject.country = 'Belgium';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(false);

        subject.country = 'Germany';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(true);

        subject.country = 'Germany';
        subject.state = '';
        expect(subject.validation.checkAll()).toBe(false);
    });

    it('should work with endIf and else statement', () => {
        var subject = TestSubject.createInstance('John');
        subject.validation
            .ensure('state')
            .if(() => { return subject.country === 'US'; })
                .in(['TX', 'FL'])
                .if( () => { return subject.state === 'FL'})
                    .passes( () => {return subject.age >= 65;})
                .endIf() //without endif, the 'else' would apply if state !== 'FL'
            .else()
                .passes( () => { return subject.age >= 18;})
            .endIf()
            .notEmpty();  //Without the endif, the 'notEmpty' would only apply to the above else case

        subject.age = 18;
        subject.country = 'US';
        subject.state = 'TX';
        expect(subject.validation.checkAll()).toBe(true);

        subject.age = 18;
        subject.country = 'US';
        subject.state = '';
        expect(subject.validation.checkAll()).toBe(false);

        subject.age = 18;
        subject.country = 'US';
        subject.state = 'FL';
        expect(subject.validation.checkAll()).toBe(false);

        subject.age = 70;
        subject.country = 'US';
        subject.state = 'FL';
        expect(subject.validation.checkAll()).toBe(true);

        subject.age = 18;
        subject.country = 'Belgium';
        subject.state = 'WVL';
        expect(subject.validation.checkAll()).toBe(true);

        subject.age = 18;
        subject.country = 'Belgium';
        subject.state = '';
        expect(subject.validation.checkAll()).toBe(false);
    });
});