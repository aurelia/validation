import {ObserverLocator} from 'aurelia-binding';
import {Validation} from '../../src/validation/validation';
import {ValidateAttachedBehavior} from '../../src/validation/validateAttachedBehavior';
import {ValidateAttachedBehaviorConfig} from '../../src/validation/validateAttachedBehaviorConfig'


class TestSubject {
    constructor(validation){
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

    static createInstance() {
        return new TestSubject(new Validation(new ObserverLocator()));
    }
}

class NestedTestSubject{
  constructor(validation){
    this.address =
    {
      street : 'fakestreet',
      number : '123'

    };
    this.validationNested = validation.on(this)
      .ensure('address.street')
        .notEmpty()
        .betweenLength(3,10)
      .ensure('address.number')
        .notEmpty()
        .betweenLength(1,10);

    this.validation = validation.on(this.address)
      .ensure('street')
        .notEmpty()
        .betweenLength(3,10)
      .ensure('number')
        .notEmpty()
        .betweenLength(1,10);
  }

  static createInstance(firstName) {
    return new NestedTestSubject(new Validation(new ObserverLocator()));
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
        var subject = TestSubject.createInstance();
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
        var behavior = new ValidateAttachedBehavior(testHTML, new ObserverLocator(), new ValidateAttachedBehaviorConfig());
        behavior.value = subject.validation;
        debugger;
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

  it('should be working with nested properties', () => {
    var subject = NestedTestSubject.createInstance(null);
    var testHTML = TestDOM.createElement(`<form role="form" submit.delegate="welcome()" >
            <div class="form-group" id="formGroupStreet">
            <label for="fn" id="labelStreet" >Street</label>
            <input type="text" value.bind="address.street" class="form-control" id="fn" placeholder="street">
            </div>
            <div class="form-group" id="formGroupNumber">
            <label for="ln"  id="labelNumber">Number</label>
            <input type="text" value.bind="address.number" class="form-control" id="ln" placeholder="number">
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
            </form>`);
    var behavior = new ValidateAttachedBehavior(testHTML, new ObserverLocator(), new ValidateAttachedBehaviorConfig());
    behavior.value = subject.validationNested;
    behavior.attached();

    subject.address.street = '';
    subject.validationNested.checkAll();

    //default: adds 'has-warning'/'has-success' to form-group
    var streetGroup = testHTML.querySelector('#formGroupStreet');
    expect(streetGroup.classList.contains('has-warning')).toBe(true);

    var numberGroup = testHTML.querySelector('#formGroupNumber');
    expect(numberGroup.classList.contains('has-success')).toBe(true);


    //default: adds <p> after label
    var streetLabel = testHTML.querySelector('#labelStreet');
    var streetMessage = streetLabel.nextSibling;
    expect(streetMessage.classList.contains('aurelia-validation-message')).toBe(true);
    expect(streetMessage.classList.contains('help-block')).toBe(true);
    expect(streetMessage.textContent).toBe('is required');


    //default: adds <p> after element
    var numberLabel = testHTML.querySelector('#labelNumber');
    var numberMessage = numberLabel.nextSibling;
    expect(numberMessage.classList.contains('aurelia-validation-message')).toBe(true);
    expect(numberMessage.classList.contains('help-block')).toBe(true);
    expect(numberMessage.textContent).toBe('');
  });


  it('should be working with validationProperties', () => {
    var subject = NestedTestSubject.createInstance(null);
    var testHTML = TestDOM.createElement(`<form role="form" submit.delegate="welcome()" >
            <div class="form-group" id="formGroupStreet">
            <label for="fn" id="labelStreet" >Street</label>
            <input type="text" value.bind="address.street" class="form-control" id="fn" placeholder="street">
            </div>
            <div class="form-group" id="formGroupNumber">
            <label for="ln"  id="labelNumber">Number</label>
            <input type="text" value.bind="address.number" class="form-control" id="ln" placeholder="number">
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
            </form>`);



    var streetBehavior = new ValidateAttachedBehavior(testHTML.querySelector('#fn'), new ObserverLocator(), new ValidateAttachedBehaviorConfig());
    streetBehavior.value = subject.validation.result.properties.street;
    streetBehavior.attached();

    var numberBehavior = new ValidateAttachedBehavior(testHTML.querySelector('#ln'), new ObserverLocator(), new ValidateAttachedBehaviorConfig());
    numberBehavior.value = subject.validation.result.properties.number;
    numberBehavior.attached();

    subject.address.street = '';
    subject.validation.checkAll();

    //default: adds 'has-warning'/'has-success' to form-group
    var streetGroup = testHTML.querySelector('#formGroupStreet');
    expect(streetGroup.classList.contains('has-warning')).toBe(true);

    var numberGroup = testHTML.querySelector('#formGroupNumber');
    expect(numberGroup.classList.contains('has-success')).toBe(true);


    //default: adds <p> after label
    var streetLabel = testHTML.querySelector('#labelStreet');
    var streetMessage = streetLabel.nextSibling;
    expect(streetMessage.classList.contains('aurelia-validation-message')).toBe(true);
    expect(streetMessage.classList.contains('help-block')).toBe(true);
    expect(streetMessage.textContent).toBe('is required');


    //default: adds <p> after element
    var numberLabel = testHTML.querySelector('#labelNumber');
    var numberMessage = numberLabel.nextSibling;
    expect(numberMessage.classList.contains('aurelia-validation-message')).toBe(true);
    expect(numberMessage.classList.contains('help-block')).toBe(true);
    expect(numberMessage.textContent).toBe('');
  });


  it('should only use the "value.bind" if no extra "validate" attribute is present', () => {
    var subject = TestSubject.createInstance();
    var testHTML = TestDOM.createElement(`<form role="form" submit.delegate="welcome()" >
            <div class="form-group" id="formGroupFirstName">
            <label for="fn" id="labelFirstName" >First Name</label>
            <input type="text" value.bind="lastName" validate="firstName" class="form-control" id="fn" placeholder="first name">
            </div>
            <div class="form-group" id="formGroupLastName">
            <label for="ln"  id="labelLastName">Last Name</label>
            <input type="text" value.bind="firstName" validate="lastName" class="form-control" id="ln" placeholder="last name">
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
            </form>`);
    var behavior = new ValidateAttachedBehavior(testHTML, new ObserverLocator(), new ValidateAttachedBehaviorConfig());
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

