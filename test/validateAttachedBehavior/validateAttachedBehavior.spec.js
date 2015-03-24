import {ObserverLocator} from 'aurelia-binding';
import {Validation} from '../../src/validation/validation';
import {ValidateAttachedBehavior} from '../../src/validation/validateAttachedBehavior'


class TestSubject {
    constructor(validation, firstName, lastName){
        this.firstName = 'John';
        this.lastName = 'Doe';
        this.validation = validation.on(this)
            .ensure('firstName')
                .notEmpty()
                .betweenLength(3,10)
            .ensure('lastName')
                .notEmpty()
                .betweenLength(3,10);
    }

    static createInstance(firstName) {
        return new TestSubject(new Validation(new ObserverLocator()));
    }
}
class TestDOM{
    static createElement(html){
        var element = document.createElement('DIV');
        element.innerHTML = html;
        return element.children[0];
    }
}

describe('Tests on ValidateAttachedBehavior', () => {
    it('should be working', () => {
        var subject = TestSubject.createInstance(null);
        var testHTML = TestDOM.createElement(`<form role="form" submit.delegate="welcome()" >
            <div class="form-group" id="formGroupFirstName">
            <label for="fn" id="labelFirstName" >First Name</label>
            <input type="text" value.bind="firstName" class="form-control" id="fn" placeholder="first name">
            </div>
            <div class="form-group" id="formGroupLastName">
            <label for="ln"  id="labelLastName">Last Name</label>
            <input type="text" value.bind="lastName" class="form-control" id="ln" placeholder="last name">
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
            </form>`);
        var behavior = new ValidateAttachedBehavior(testHTML, new ObserverLocator());
        behavior.value = subject.validation;
        behavior.attached();

        subject.firstName = '';
        subject.validation.checkAll();

        //default: adds 'has-warning'/'has-success' to form-group
        var firstNameGroup = testHTML.querySelector('#formGroupFirstName');
        expect(firstNameGroup.classList.contains('has-warning')).toBe(true);

        var lastNameGroup = testHTML.querySelector('#formGroupLastName');
        expect(lastNameGroup.classList.contains('has-success')).toBe(true);


        //default: adds <p> after label
        var firstNameLabel = testHTML.querySelector('#labelFirstName');
        var firstNameMessage = firstNameLabel.nextSibling;
        expect(firstNameMessage.classList.contains('aurelia-validation-message')).toBe(true);
        expect(firstNameMessage.classList.contains('help-block')).toBe(true);
        expect(firstNameMessage.textContent).toBe('is required');


        //default: adds <p> after element
        var lastNameLabel = testHTML.querySelector('#labelLastName');
        var lastNameMessage = lastNameLabel.nextSibling;
        expect(lastNameMessage.classList.contains('aurelia-validation-message')).toBe(true);
        expect(lastNameMessage.classList.contains('help-block')).toBe(true);
        expect(lastNameMessage.textContent).toBe('');
    });
});

