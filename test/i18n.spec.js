import {ObserverLocator} from 'aurelia-binding';
import {Validation} from '../src/validation/validation';

class TestSubject {
    constructor(validation){
        this.firstName = '';
        this.wealth =  '';
        this.validation = validation.on(this)
            .ensure('firstName')
                .notEmpty()
            .ensure('wealth')
                .notEmpty()
                .isNumeric();
    }
    static createInstance() {
        return new TestSubject(new Validation(new ObserverLocator()));
    }
}
describe('I18N tests: messages', () => {
    it('should use a default message (en-US) without loading a locale', () => {
        var subject = TestSubject.createInstance(null);
        subject.validation.checkAll();
        expect(subject.validation.result.properties.firstName.message).toBe('is required');
    });
    it('should result in properly translated default error message for nl-BE', (done) => {
        Validation.Locale.load('nl-BE').then(()=> {
            var subject = TestSubject.createInstance(null);
            subject.validation.checkAll();
            expect(subject.validation.result.properties.firstName.message).toBe('is verplicht');
            Validation.Locale.reset();
            done();
        });
    });
    it('should result in properly translated default error message for nl-NL', (done) => {
        Validation.Locale.load('nl-NL').then(()=> {
            var subject = TestSubject.createInstance(null);
            subject.validation.checkAll();
            expect(subject.validation.result.properties.firstName.message).toBe('is verplicht');
            Validation.Locale.reset();
            done();
        });
    });

    it('should result in properly translated default error message for de-DE', (done) => {
        Validation.Locale.load('de-DE').then(()=> {
            var subject = TestSubject.createInstance(null);
            subject.validation.checkAll();
            expect(subject.validation.result.properties.firstName.message).toBe('wird benötigt');
            Validation.Locale.reset();
            done();
        });
    });

    it('should result in properly translated default error message for fr-FR', (done) => {
        Validation.Locale.load('fr-FR').then(()=> {
            var subject = TestSubject.createInstance(null);
            subject.validation.checkAll();
            expect(subject.validation.result.properties.firstName.message).toBe('est obligatoire');
            Validation.Locale.reset();
            done();
        });
    });



    it('should result in properly translated default error message for en-US', (done) => {
        Validation.Locale.load('en-US').then(()=> {
            var subject = TestSubject.createInstance(null);
            subject.validation.checkAll();
            expect(subject.validation.result.properties.firstName.message).toBe('is required');
            Validation.Locale.reset();
            done();
        });
    });
});

describe('I18N tests: number', () => {
    it('should use a default number format (en-US) without loading a locale', () => {
        var subject = TestSubject.createInstance(null);
        subject.firstName = 'John';
        subject.wealth = '3,000,000.00';
        expect(subject.validation.checkAll()).toBe(true);


        subject.wealth = '3.000.000';
        expect(subject.validation.checkAll()).toBe(false);
        expect(subject.validation.result.properties.wealth.message).toBe('needs to be a number');
    });
    it('should result in properly translated default error message', (done) => {
        Validation.Locale.load('nl-BE').then(()=> {
            var subject = TestSubject.createInstance(null);
            subject.firstName = 'John';
            subject.wealth = '3000000,00';
            expect(subject.validation.checkAll()).toBe(true);



            subject.wealth = '3000,000,00';
            expect(subject.validation.checkAll()).toBe(false);
            expect(subject.validation.result.properties.wealth.message).toBe('moet een getal zijn');
            Validation.Locale.reset();
            done();
        });
    });
});
