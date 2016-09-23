import {StageComponent, ComponentTester} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {RegistrationForm} from './resources/registration-form';
import {validateTrigger} from '../src/aurelia-validation';
import {configure, blur, change} from './shared';

describe('end to end', () => {
  it('basic scenarios', (done: () => void) => {
    const component: ComponentTester = StageComponent
      .withResources()
      .inView('<registration-form></registration-form>')
      .boundTo({});
    component.bootstrap(configure);

    let firstName: HTMLInputElement, lastName: HTMLInputElement,
        number1: HTMLInputElement, number2: HTMLInputElement,
        password: HTMLInputElement, confirmPassword: HTMLInputElement;

    let viewModel: RegistrationForm;

    let renderer = { render: jasmine.createSpy() };

    (<Promise<any>>component.create(<any>bootstrap))
      // grab some references.
      .then(() => {
        viewModel = component.viewModel;
        viewModel.controller.addRenderer(renderer);        
        firstName = <HTMLInputElement>component.element.querySelector('#firstName');
        lastName = <HTMLInputElement>component.element.querySelector('#lastName');
        number1 = <HTMLInputElement>component.element.querySelector('#number1');
        number2 = <HTMLInputElement>component.element.querySelector('#number2');
        password = <HTMLInputElement>component.element.querySelector('#password');
        confirmPassword = <HTMLInputElement>component.element.querySelector('#confirmPassword');
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
      .then(() => {
        expect(viewModel.controller.errors.length).toBe(1);
        const calls = renderer.render.calls;
        const renderInstruction = calls.argsFor(calls.count() - 1)[0];
        expect(renderInstruction.render[0].elements[0]).toBe(lastName);
      })
      // blur the number1 field- this should trigger validation.
      .then(() => blur(number1))
      // confirm there's an error.
      .then(() => {
        expect(viewModel.controller.errors.length).toBe(2);
        const calls = renderer.render.calls;
        const renderInstruction = calls.argsFor(calls.count() - 1)[0];
        expect(renderInstruction.render[0].elements[0]).toBe(number1);
      })
      // blur the number2 field- this should trigger validation.
      .then(() => blur(number2))
      // confirm there's an error.
      .then(() => {
        expect(viewModel.controller.errors.length).toBe(3);
        const calls = renderer.render.calls;
        const renderInstruction = calls.argsFor(calls.count() - 1)[0];
        expect(renderInstruction.render[0].elements[0]).toBe(number2);
      })
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
        viewModel.password = 'a';
        viewModel.confirmPassword = 'a';
        viewModel.controller.reset();
      })
      // make the passwords mismatch.
      .then(() => change(confirmPassword, 'b'))
      // confirm the custom validator worked
      .then(() => expect(viewModel.controller.errors[0].message).toBe('Confirm Password must match Password'))

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
      .then(() => expect(viewModel.controller.errors.length).toBe(6))
      // reset all bindings
      .then(() => viewModel.controller.reset())
      // confirm resetting cleared all errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(0))

      // hide the form and change the validateTrigger.
      .then(() => {
        viewModel.showForm = false;
        viewModel.controller.validateTrigger = validateTrigger.changeOrBlur;
      })
      // show the form
      .then(() => viewModel.showForm = true)
      // confirm hiding and showing the form reset the errors.
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
      // change the lastName field- this should trigger validation.
      .then(() => change(lastName, 'abcdef'))
      .then(() => change(lastName, ''))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1))

      // cleanup and finish.
      .then(() => component.dispose())
      .then(done);
  });
});
