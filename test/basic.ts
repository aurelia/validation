import {StageComponent, ComponentTester} from 'aurelia-testing';
import {Aurelia} from 'aurelia-framework';
import {bootstrap} from 'aurelia-bootstrapper';
import {DOM} from 'aurelia-pal';
import {RegistrationForm} from './resources/registration-form';
import {validateTrigger} from '../src/aurelia-validation';

declare var describe: { (name: string, fn: () => void): void };
// declare var beforeEach: { (fn: () => void): void };
// declare var afterEach: { (fn: () => void): void };
declare var it: { (name: string, fn: (done?: () => void) => void): void };
declare var expect: (x: any) => any;

function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin('dist/test/src/aurelia-validation')
    .feature('./dist/test/test/resources');
}

function blur(element: Element): Promise<void> {
  element.dispatchEvent(DOM.createCustomEvent('blur', {}));
  return new Promise<void>(setTimeout);
}

function change(element: HTMLInputElement, value: string): Promise<void> {
  element.value = value;
  element.dispatchEvent(DOM.createCustomEvent('change', { bubbles: true }));  
  return new Promise<void>(setTimeout);
}

describe('end to end', () => {
  it('basic scenarios', (done: () => void) => {
    const component: ComponentTester = StageComponent
      .withResources()
      .inView('<registration-form></registration-form>')
      .boundTo({});
    component.bootstrap(configure);

    let firstName: HTMLInputElement, lastName: HTMLInputElement, number1: HTMLInputElement, number2: HTMLInputElement;
    let viewModel: RegistrationForm;
    (<Promise<any>>component.create(<any>bootstrap))
      // grab some references.
      .then(() => {
        viewModel = component.viewModel;        
        firstName = <HTMLInputElement>component.element.querySelector('#firstName');
        lastName = <HTMLInputElement>component.element.querySelector('#lastName');
        number1 = <HTMLInputElement>component.element.querySelector('#number1');
        number2 = <HTMLInputElement>component.element.querySelector('#number2');      
      })
      // initially there should not be any errors
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      // blur the firstName field- this should trigger validation.
      .then(() => blur(firstName))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      // make a model change to the firstName field. 
      // this should reset the errors for the firstName field.
      .then(() => viewModel.firstName = 'test')
      // confirm the errors were reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      // blur the lastName field- this should trigger validation.
      .then(() => blur(lastName))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1))

      // blur the number1 field- this should trigger validation.
      .then(() => blur(number1))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(2))
      // blur the number2 field- this should trigger validation.
      .then(() => blur(number2))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(3))
      // make a model change to the number1 field. 
      // this should reset the errors for the number1 field.
      .then(() => viewModel.number1 = 1)
      // confirm the error was reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(2))
      // make a model change to the number2 field. 
      // this should reset the errors for the number2 field.
      .then(() => viewModel.number2 = 2)
      // confirm the error was reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(1))      
      // change the numbers back to invalid values.
      .then(() => {
        viewModel.number1 = 0;
        viewModel.number2 = 0;
      })     

      // hide the form and change the validateTrigger.
      .then(() => {
        viewModel.showForm = false;
        viewModel.controller.validateTrigger = validateTrigger.change;
      })
      // show the form
      .then(() => viewModel.showForm = true)
      // confirm hiding and showing the form reset the errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      // change the firstName field- this should trigger validation.
      .then(() => change(firstName, 'test'))
      // confirm there's no error.
      .then(() => expect(viewModel.controller.errors.length).toBe(0))      
      // change the firstName field- this should trigger validation.
      .then(() => change(firstName, ''))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      // change the number1 field- this should trigger validation.
      .then(() => change(number1, '-1'))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(2))
      // change the number2 field- this should trigger validation.
      .then(() => change(<HTMLInputElement>number2.firstElementChild, '-1'))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(3))
      // change the number1 field- this should trigger validation.
      .then(() => change(number1, '32'))
      // confirm the error was reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(2))
      // change the number2 field- this should trigger validation.
      .then(() => change(<HTMLInputElement>number2.firstElementChild, '23'))
      // confirm the error was reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      // change the numbers back to invalid values.
      .then(() => {
        viewModel.number1 = 0;
        viewModel.number2 = 0;
      }) 

      // hide the form and change the validateTrigger.
      .then(() => {
        viewModel.showForm = false;
        viewModel.controller.validateTrigger = validateTrigger.manual;
      })
      // show the form
      .then(() => viewModel.showForm = true)
      // confirm hiding and showing the form reset the errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      // validate all bindings
      .then(() => viewModel.controller.validate())
      // confirm validating resulted in errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(5))
      // reset all bindings
      .then(() => viewModel.controller.reset())
      // confirm resetting cleared all errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(0))

      // cleanup and finish.
      .then(() => component.dispose())
      .then(done);
  });
});
