import {Validation} from '../../src/validation';
import {ValidateCustomAttribute} from '../../src/validate-custom-attribute';
import {TWBootstrapViewStrategy} from '../../src/strategies/twbootstrap-view-strategy';
import {Expectations} from '../expectations';
import {ObserverLocator} from 'aurelia-binding';
import {TaskQueue} from 'aurelia-task-queue';

class TestSubject {
  constructor(validation, callback) {
    this.firstName = 'John';
    this.lastName = 'Doe';
    this.address = {};
    this.validation = validation.on(this, callback)
      .ensure('firstName')
      .isNotEmpty()
      .hasLengthBetween(3, 10)
      .ensure('lastName')
      .isNotEmpty()
      .hasLengthBetween(3, 10);
  }

  static createInstance(callback) {
    return new TestSubject(new Validation(new ObserverLocator(new TaskQueue())), callback);
  }
}

class NestedTestSubject {
  constructor(validation, callback) {
    this.address =
    {
      street: 'fakestreet',
      number: '123'

    };
    this.validationNested = validation.on(this, callback)
      .ensure('address.street')
      .isNotEmpty()
      .hasLengthBetween(3, 10)
      .ensure('address.number')
      .isNotEmpty()
      .hasLengthBetween(1, 10);

    this.validation = validation.on(this.address, callback)
      .ensure('street')
      .isNotEmpty()
      .hasLengthBetween(3, 10)
      .ensure('number')
      .isNotEmpty()
      .hasLengthBetween(1, 10);
  }

  static createInstance(callback) {
    return new NestedTestSubject(new Validation(new ObserverLocator(new TaskQueue())), callback);
  }

}
class TestDOM {
  static createElement(html) {
    var element = document.createElement('DIV');
    element.innerHTML = html;
    return element.children[0];
  }
}

describe('Tests on ValidateCustomAttribute', () => {
  it('should be working with a simple use case', (done) => {
    var expectations = new Expectations(expect, done);
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
    var behavior = new ValidateCustomAttribute(testHTML);
    behavior.value = subject.validation;
    behavior.attached();

    subject.firstName = '';

    expectations.assert( subject.validation.validate(), false);

    expectations.assert(() => {
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
      return Promise.resolve(true);
    }, true);

    expectations.validate();


  });

  it('should be working with a different view strategy', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance( (config) => {
      config.useViewStrategy(TWBootstrapViewStrategy.AppendToInput);
    });
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
    var behavior = new ValidateCustomAttribute(testHTML);
    behavior.value = subject.validation;
    behavior.attached();

    subject.firstName = '';

    expectations.assert( subject.validation.validate(), false);

    expectations.assert(() => {
      //default: adds 'has-warning'/'has-success' to form-group
      var firstNameGroup = testHTML.querySelector('#formGroupFirstName');
      expect(firstNameGroup.classList.contains('has-warning')).toBe(true);

      var lastNameGroup = testHTML.querySelector('#formGroupLastName');
      expect(lastNameGroup.classList.contains('has-success')).toBe(true);


      //new view strategy: adds <p> after input
      var firstNameLabel = testHTML.querySelector('#fn');
      var firstNameMessage = firstNameLabel.nextSibling;
      expect(firstNameMessage.classList.contains('aurelia-validation-message')).toBe(true);
      expect(firstNameMessage.classList.contains('help-block')).toBe(true);
      expect(firstNameMessage.textContent).toBe('is required');


      //default: adds <p> after element
      var lastNameLabel = testHTML.querySelector('#ln');
      var lastNameMessage = lastNameLabel.nextSibling;
      expect(lastNameMessage.classList.contains('aurelia-validation-message')).toBe(true);
      expect(lastNameMessage.classList.contains('help-block')).toBe(true);
      expect(lastNameMessage.textContent).toBe('');
      return Promise.resolve(true);
    }, true);

    expectations.validate();


  });


  it('should be working with a bindings that contain a valueFormatter', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance();
    var testHTML = TestDOM.createElement(`<form role="form" submit.delegate="welcome()" >
            <div class="form-group" id="formGroupFirstName">
            <label for="fn" id="labelFirstName" >First Name</label>
            <input type="text" value.bind="firstName | toUpper" class="form-control" id="fn" placeholder="first name">
            </div>
            <div class="form-group" id="formGroupLastName">
            <label for="ln"  id="labelLastName">Last Name</label>
            <input type="text" value.bind="lastName | trim | toLower" class="form-control" id="ln" placeholder="last name">
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
            </form>`);
    var behavior = new ValidateCustomAttribute(testHTML);
    behavior.value = subject.validation;
    behavior.attached();

    subject.firstName = '';

    expectations.assert( subject.validation.validate(), false);

    expectations.assert(() => {
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
      return Promise.resolve(true);
    }, true);

    expectations.validate();


  });


  it('should add "success" to properties that have no rules defined', (done) => {
    var expectations = new Expectations(expect, done);
    var subject = TestSubject.createInstance();
    var testHTML = TestDOM.createElement(`<form role="form" submit.delegate="welcome()" >
            <div class="form-group" id="formGroupAddress">
            <label for="ad" id="labelAddress" >Address</label>
            <input type="text" value.bind="address" class="form-control" id="ad" placeholder="address" validate="address">
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
            </form>`);
    var behavior = new ValidateCustomAttribute(testHTML);
    behavior.value = subject.validation;
    behavior.attached();


    expectations.assert(() => {
      subject.validation.validate();
    }, false);

    expectations.assert(() => {
      //default: adds 'has-warning'/'has-success' to form-group
      var addressGroup = testHTML.querySelector('#formGroupAddress');
      expect(addressGroup.classList.contains('has-success')).toBe(true);

      //default: adds <p> after label
      var addressLabel = testHTML.querySelector('#labelAddress');
      var addressMessage = addressLabel.nextSibling;
      expect(addressMessage.classList.contains('aurelia-validation-message')).toBe(true);
      expect(addressMessage.classList.contains('help-block')).toBe(true);
      expect(addressMessage.textContent).toBe('');
      return Promise.resolve(true);
    }, true);

    expectations.validate();


  });

  it('should be working even before validate() is called', (done) => {
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
    var behavior = new ValidateCustomAttribute(testHTML);
    behavior.value = subject.validation;
    behavior.attached();

    setTimeout(() => {
      //default: adds 'has-warning'/'has-success' to form-group
      var firstNameGroup = testHTML.querySelector('#formGroupFirstName');
      expect(firstNameGroup.classList.contains('has-warning')).toBe(false);

      var lastNameGroup = testHTML.querySelector('#formGroupLastName');
      expect(lastNameGroup.classList.contains('has-success')).toBe(false);


      //default: adds <p> after label
      var firstNameLabel = testHTML.querySelector('#labelFirstName');
      var firstNameMessage = firstNameLabel.nextSibling;
      expect(firstNameMessage.classList.contains('aurelia-validation-message')).toBe(true);
      expect(firstNameMessage.classList.contains('help-block')).toBe(true);
      expect(firstNameMessage.textContent).toBe('');


      //default: adds <p> after element
      var lastNameLabel = testHTML.querySelector('#labelLastName');
      var lastNameMessage = lastNameLabel.nextSibling;
      expect(lastNameMessage.classList.contains('aurelia-validation-message')).toBe(true);
      expect(lastNameMessage.classList.contains('help-block')).toBe(true);
      expect(lastNameMessage.textContent).toBe('');
      done();
    }, 0);
  });


  describe('Tests on ValidateCustomAttribute', () => {
    it('should be working if labels have no proper "for" attribute', (done) => {
      var expectations = new Expectations(expect, done);
      var subject = TestSubject.createInstance();
      var testHTML = TestDOM.createElement(`<form role="form" submit.delegate="welcome()" >
            <div class="form-group" id="formGroupFirstName">
            <label id="labelFirstName" >First Name</label>
            <input type="text" value.bind="firstName" class="form-control" id="fn" placeholder="first name">
            </div>
            <div class="form-group" id="formGroupLastName">
            <label id="labelLastName">Last Name</label>
            <input type="text" value.bind="lastName" class="form-control" id="ln" placeholder="last name">
            </div>
            <button type="submit" class="btn btn-default">Submit</button>
            </form>`);
      var behavior = new ValidateCustomAttribute(testHTML);
      behavior.value = subject.validation;
      behavior.attached();

      subject.firstName = '';

      expectations.assert( subject.validation.validate(), false);

      expectations.assert(() => {

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
        return Promise.resolve(true);
      }, true);

      expectations.validate();


    });
  });

  it('should be working with nested properties', (done) => {
    var expectations = new Expectations(expect, done);
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
    var behavior = new ValidateCustomAttribute(testHTML);
    behavior.value = subject.validationNested;
    behavior.attached();

    subject.address.street = '';

    expectations.assert( subject.validationNested.validate(), false);

    expectations.assert(() => {

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
      return Promise.resolve(true);
    }, true);

    expectations.validate();
  });

  it('should only use the "value.bind" if no extra "validate" attribute is present', (done) => {
    var expectations = new Expectations(expect, done);
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
    var behavior = new ValidateCustomAttribute(testHTML);
    behavior.value = subject.validation;
    behavior.attached();

    subject.firstName = '';

    expectations.assert( subject.validation.validate(), false);

    expectations.assert(() => {

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

      return Promise.resolve(true);
    }, true);

    expectations.validate();
  });
});
