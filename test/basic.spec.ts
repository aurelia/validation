import { StageComponent, ComponentTester } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { RegistrationForm } from './resources/registration-form';
import { validateTrigger, ValidateEvent } from '../src/aurelia-validation';
import { configure, blur, change, focusout } from './shared';

describe('end to end', () => {
  it('basic scenarios', (done: () => void) => {
    const component: ComponentTester = StageComponent
      .withResources()
      .inView('<registration-form></registration-form>')
      .boundTo({});
    component.bootstrap(configure);

    let firstName: HTMLInputElement;
    let lastName: HTMLInputElement;
    let number1: HTMLInputElement;
    let number2: HTMLInputElement;
    // let password: HTMLInputElement;
    let confirmPassword: HTMLInputElement;
    let ceInput: HTMLInputElement;

    let viewModel: RegistrationForm;

    const renderer = { render: jasmine.createSpy() };

    component.create(bootstrap as any)
      // grab some references.
      .then(() => {
        viewModel = component.viewModel;
        viewModel.controller.addRenderer(renderer);
        firstName = component.element.querySelector('#firstName') as HTMLInputElement;
        lastName = component.element.querySelector('#lastName') as HTMLInputElement;
        number1 = component.element.querySelector('#number1') as HTMLInputElement;
        number2 = component.element.querySelector('#number2') as HTMLInputElement;
        // password = component.element.querySelector('#password') as HTMLInputElement;
        confirmPassword = component.element.querySelector('#confirmPassword') as HTMLInputElement;
        ceInput = component.element.querySelector('custom-input#ce input') as HTMLInputElement;
      })
      // initially there should not be any errors
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error1'))
      // blur the ceInput field- this should not trigger validation.
      .then(() => blur(ceInput))
      // confirm there are no errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error1.1'))
      // focusout the ceInput field - this should not trigger validation as well because the default trigger is blur.
      .then(() => focusout(ceInput))
      // confirm there are no errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error1.2'))
      // blur the firstName field- this should trigger validation.
      .then(() => blur(firstName))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error2'))
      // make a model change to the firstName field.
      // this should reset the errors for the firstName field.
      .then(() => viewModel.firstName = 'test')
      // confirm the errors were reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error3'))
      // blur the firstName field- this should trigger validation.
      .then(() => blur(firstName))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error2.1'))
      // make a model change to the firstName field.
      // this should reset the errors for the firstName field.
      .then(() => viewModel.firstName = 'foo')
      // confirm the errors were reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error3.1'))
      // blur the lastName field- this should trigger validation.
      .then(() => blur(lastName))
      // confirm there's an error.
      .then(() => {
        expect(viewModel.controller.errors.length).toBe(1, 'error4');
        const calls = renderer.render.calls;
        const renderInstruction = calls.argsFor(calls.count() - 1)[0];
        expect(renderInstruction.render[0].elements[0]).toBe(lastName, 'error5');
      })
      // blur the number1 field- this should trigger validation.
      .then(() => blur(number1))
      // confirm there's an error.
      .then(() => {
        expect(viewModel.controller.errors.length).toBe(2, 'error6');
        const calls = renderer.render.calls;
        const renderInstruction = calls.argsFor(calls.count() - 1)[0];
        expect(renderInstruction.render[0].elements[0]).toBe(number1, 'error7');
      })
      // blur the number2 field- this should trigger validation.
      .then(() => blur(number2))
      // confirm there's an error.
      .then(() => {
        expect(viewModel.controller.errors.length).toBe(3, 'error8');
        const calls = renderer.render.calls;
        const renderInstruction = calls.argsFor(calls.count() - 1)[0];
        expect(renderInstruction.render[0].elements[0]).toBe(number2, 'error9');
      })
      // make a model change to the number1 field.
      // this should reset the errors for the number1 field.
      .then(() => viewModel.number1 = 1)
      // confirm the error was reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(2, 'error10'))
      // make a model change to the number2 field.
      // this should reset the errors for the number2 field.
      .then(() => viewModel.number2 = 2)
      // confirm the error was reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error11'))
      // change the numbers back to invalid values.
      .then(() => {
        viewModel.number1 = 0;
        viewModel.number2 = 0;
        viewModel.firstName = '';
      })

      // hide the form and change the validateTrigger to 'focusout'.
      .then(() => {
        viewModel.showForm = false;
        viewModel.controller.validateTrigger = validateTrigger.focusout;
      })
      // show the form
      .then(() => viewModel.showForm = true)
      // initially there should not be any errors
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error100.1'))
      // focusout the ceInput field - this trigger validation.
      .then(() => focusout(ceInput))
      // confirm there are no errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error100.2'))
      // make a model change to the firstName field.
      // this should reset the errors for the firstName field.
      .then(() => viewModel.ceValue = 'test')
      // confirm the errors were reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error100.2.1'))
      // focusout the firstName field- this should trigger validation.
      .then(() => focusout(firstName))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error100.3'))
      // make a model change to the firstName field.
      // this should reset the errors for the firstName field.
      .then(() => viewModel.firstName = 'test')
      // confirm the errors were reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error100.4'))
      // focusout the firstName field- this should trigger validation.
      .then(() => focusout(firstName))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error100.3.1'))
      // make a model change to the firstName field.
      // this should reset the errors for the firstName field.
      .then(() => viewModel.firstName = 'foo')
      // confirm the errors were reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error100.4.1'))
      // focusout the lastName field- this should trigger validation.
      .then(() => focusout(lastName))
      // confirm there's an error.
      .then(() => {
        expect(viewModel.controller.errors.length).toBe(1, 'error100.5');
        const calls = renderer.render.calls;
        const renderInstruction = calls.argsFor(calls.count() - 1)[0];
        expect(renderInstruction.render[0].elements[0]).toBe(lastName, 'error100.6');
      })
      // focusout the number1 field- this should trigger validation.
      .then(() => focusout(number1))
      // confirm there's an error.
      .then(() => {
        expect(viewModel.controller.errors.length).toBe(2, 'error100.7');
        const calls = renderer.render.calls;
        const renderInstruction = calls.argsFor(calls.count() - 1)[0];
        expect(renderInstruction.render[0].elements[0]).toBe(number1, 'error100.8');
      })
      // focusout the number2 field- this should trigger validation.
      .then(() => focusout(number2))
      // confirm there's an error.
      .then(() => {
        expect(viewModel.controller.errors.length).toBe(3, 'error100.9');
        const calls = renderer.render.calls;
        const renderInstruction = calls.argsFor(calls.count() - 1)[0];
        expect(renderInstruction.render[0].elements[0]).toBe(number2, 'error100.10');
      })
      // make a model change to the number1 field.
      // this should reset the errors for the number1 field.
      .then(() => viewModel.number1 = 1)
      // confirm the error was reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(2, 'error100.11'))
      // make a model change to the number2 field.
      // this should reset the errors for the number2 field.
      .then(() => viewModel.number2 = 2)
      // confirm the error was reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error100.12'))
      // change the numbers back to invalid values.
      .then(() => {
        viewModel.number1 = 0;
        viewModel.number2 = 0;
        viewModel.firstName = '';
      })

      // hide the form and change the validateTrigger to 'change'.
      .then(() => {
        viewModel.showForm = false;
        viewModel.controller.validateTrigger = validateTrigger.change;
      })
      // show the form
      .then(() => viewModel.showForm = true)
      // confirm hiding and showing the form reset the errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error12'))
      // change the firstName field- this should trigger validation.
      .then(() => change(ceInput, 'test'))
      // confirm there's no error.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error13'))
      // change the firstName field- this should trigger validation.
      .then(() => change(ceInput, ''))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error14'))
      // change the firstName field- this should trigger validation.
      .then(() => change(firstName, 'foo'))
      // confirm there's no error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error13'))
      // change the firstName field- this should trigger validation.
      .then(() => change(firstName, ''))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(2, 'error14'))
      // change the number1 field- this should trigger validation.
      .then(() => change(number1, '-1'))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(3, 'error15'))
      // change the number2 field- this should trigger validation.
      .then(() => change(number2.firstElementChild as HTMLInputElement, '-1'))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(4, 'error16'))
      // change the number1 field- this should trigger validation.
      .then(() => change(number1, '32'))
      // confirm the error was reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(3, 'error17'))
      // change the number2 field- this should trigger validation.
      .then(() => change(number2.firstElementChild as HTMLInputElement, '23'))
      // confirm the error was reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(2, 'error18'))
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
      .then(() => expect(viewModel.controller.errors[0].message)
        .toBe('Confirm Password must match Password', 'error19'))

      // hide the form and change the validateTrigger to 'manual'.
      .then(() => {
        viewModel.showForm = false;
        viewModel.controller.validateTrigger = validateTrigger.manual;
      })
      // show the form
      .then(() => viewModel.showForm = true)
      // confirm hiding and showing the form reset the errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error20'))
      // validate all bindings
      .then(() => viewModel.controller.validate())
      // confirm validating resulted in errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(7, 'error21'))
      // reset all bindings
      .then(() => viewModel.controller.reset())
      // confirm resetting cleared all errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error22'))

      // hide the form and change the validateTrigger to 'changeOrBlur'.
      .then(() => {
        viewModel.showForm = false;
        viewModel.controller.validateTrigger = validateTrigger.changeOrBlur;
      })
      // show the form
      .then(() => viewModel.showForm = true)
      // confirm hiding and showing the form reset the errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error23'))
      // blur the ceInput field- this should trigger validation.
      .then(() => blur(ceInput))
      // confirm there's no error as the event won't bubble
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error24'))
      // make a model change to the firstName field.
      // and blur the field
      .then(() => change(ceInput, 'test'))
      .then(() => blur(ceInput))
      // confirm there are no errors as blur still does not bubble
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error25'))
      // focusout the field
      .then(() => focusout(ceInput))
      // confirm there are no errors as no handler for focusout
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error25'))
      // blur the firstName field- this should trigger validation.
      .then(() => blur(firstName))
      // confirm there's no error as it is still pristine.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error24'))
      // make a model change to the firstName field.
      // and trigger the first validation by blurring the field
      .then(() => change(firstName, 'test'))
      .then(() => blur(firstName))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error25'))
      // As the field is already touched by validation, changing the value to a valid one should reset the error
      .then(() => change(firstName, 'foo'))
      // confirm the errors were reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error25.1'))
      // change the lastName field- this should trigger validation.
      .then(() => change(lastName, 'abcdef'))
      .then(() => change(lastName, ''))
      .then(() => blur(lastName))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error26'))
      // make lastName valid again
      .then(() => change(lastName, 'ghi'))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error27'))
      // change the numbers back to invalid values.
      .then(() => {
        viewModel.number1 = 0;
        viewModel.number2 = 0;
        viewModel.ceValue = '';
        viewModel.firstName = '';
        viewModel.lastName = '';
        viewModel.password = 'a';
        viewModel.controller.reset();
      })
      // perform manual validation and
      // assert that when the values are changed to valid values, all the errors are removed
      .then(() => viewModel.controller.validate())
      .then(() => expect(viewModel.controller.errors.length).toBe(7, 'error27.1'))
      .then(() => change(ceInput, 'foo'))
      .then(() => change(firstName, 'foo'))
      .then(() => change(lastName, 'test'))
      .then(() => {
        viewModel.number1 = 42;
        viewModel.number2 = 42;
        viewModel.email = 'a@b.com';
        viewModel.password = 'a';
        return change(confirmPassword, 'a');
      })
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error27.2'))
      // change the numbers back to invalid values.
      .then(() => {
        viewModel.number1 = 0;
        viewModel.number2 = 0;
        viewModel.ceValue = '';
        viewModel.firstName = '';
        viewModel.lastName = '';
      })

      // hide the form and change the validateTrigger to 'changeOrFocusout'.
      .then(() => {
        viewModel.showForm = false;
        viewModel.controller.validateTrigger = validateTrigger.changeOrFocusout;
      })
      // show the form
      .then(() => viewModel.showForm = true)
      // confirm hiding and showing the form reset the errors.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error200.1'))
      // focusout the ceInput field- this should trigger validation.
      .then(() => focusout(ceInput))
      // confirm there's an error
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error200.2'))
      // make a model change to the firstName field.
      .then(() => change(ceInput, 'test'))
      .then(() => focusout(ceInput))
      // confirm there are no errors
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error200.3'))
      // set the ceInput to valid value
      .then(() => change(ceInput, 'foo'))
      // confirm that there are no errors
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error200.3.1'))
      // focusout the firstName field- this should trigger validation.
      .then(() => focusout(firstName))
      // confirm there's no error as it is still pristine.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error200.5'))
      // make a model change to the firstName field.
      // and trigger the first validation by focusing out the field
      .then(() => change(firstName, 'test'))
      .then(() => focusout(firstName))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error200.6'))
      // As the field is already touched by validation, changing the value to a valid one should reset the error
      .then(() => change(firstName, 'foo'))
      // confirm the errors were reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error200.7'))
      // change the lastName field- this should trigger validation.
      .then(() => change(lastName, 'abcdef'))
      .then(() => change(lastName, ''))
      .then(() => focusout(lastName))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error200.8'))
      // make lastName valid again
      .then(() => change(lastName, 'ghi'))
      // confirm there's an error.
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error200.9'))
      // change the numbers back to invalid values.
      .then(() => {
        viewModel.number1 = 0;
        viewModel.number2 = 0;
        viewModel.ceValue = '';
        viewModel.firstName = '';
        viewModel.lastName = '';
        viewModel.email = '';
        viewModel.password = '';
        viewModel.controller.reset();
      })
      // perform manual validation and
      // assert that when the values are changed to valid values, all the errors are removed
      .then(() => viewModel.controller.validate())
      .then(() => expect(viewModel.controller.errors.length).toBe(7, 'error200.10'))
      .then(() => change(ceInput, 'foo'))
      .then(() => change(firstName, 'foo'))
      .then(() => change(lastName, 'test'))
      .then(() => {
        viewModel.number1 = 42;
        viewModel.number2 = 42;
        viewModel.email = 'a@b.com';
        viewModel.password = 'a';
        return change(confirmPassword, 'a');
      })
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error200.11'))

      // add some errors
      .then(() => {
        const error1 = viewModel.controller.addError('object error', viewModel);
        expect(error1.message).toBe('object error', 'error28');
        expect(error1.object).toBe(viewModel, 'error29');
        expect(error1.propertyName).toBe(null, 'error30');
        const error2 = viewModel.controller.addError('string property error', viewModel, 'lastName');
        expect(error2.message).toBe('string property error', 'error31');
        expect(error2.object).toBe(viewModel, 'error32');
        expect(error2.propertyName).toBe('lastName', 'error33');
        const error3 = viewModel.controller.addError('expression property error', viewModel, vm => vm.firstName);
        expect(error3.message).toBe('expression property error', 'error34');
        expect(error3.object).toBe(viewModel, 'error35');
        expect(error3.propertyName).toBe('firstName', 'error36');

        expect(viewModel.controller.errors.length).toBe(3, 'error37');

        viewModel.controller.removeError(error1);
        expect(viewModel.controller.errors.length).toBe(2, 'error38');

        viewModel.controller.removeError(error2);
        expect(viewModel.controller.errors.length).toBe(1, 'error39');

        viewModel.controller.removeError(error3);
        expect(viewModel.controller.errors.length).toBe(0, 'error40');
      })

      // subscribe to error events
      .then(() => {
        let event1: ValidateEvent;
        let event2: ValidateEvent;
        const spy1 = jasmine.createSpy().and.callFake((event: ValidateEvent) => event1 = event);
        const spy2 = jasmine.createSpy().and.callFake((event: ValidateEvent) => event2 = event);
        viewModel.controller.subscribe(spy1);
        viewModel.controller.subscribe(spy2);
        return Promise.resolve()
          .then(() => change(lastName, ''))
          .then(() => {
            expect(spy1).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
            expect(event1).toBeDefined();
            expect(event2).toBeDefined();
            expect(event1).toBe(event2, 'error43');
            expect(event1.errors.length).toBe(1, 'error44');
            spy1.calls.reset();
            spy2.calls.reset();
            event1 = null as any;
            event2 = null as any;
          })
          .then(() => change(firstName, ''))
          .then(() => {
            expect(spy1).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
            expect(event1).toBeDefined();
            expect(event2).toBeDefined();
            expect(event1).toBe(event2, 'error47');
            expect(event1.errors.length).toBe(2, 'error48');
          });
      })

      // cleanup and finish.
      .then(() => component.dispose())
      .then(() => done());
  });
});
