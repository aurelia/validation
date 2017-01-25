import { StageComponent, ComponentTester } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PropertyDependenciesForm } from './resources/property-dependencies-form';
import { validateTrigger } from '../src/aurelia-validation';
import { configure, change } from './shared';

describe('end to end', () => {
  it('basic scenarios', (done: () => void) => {
    const component: ComponentTester = StageComponent
      .withResources()
      .inView('<property-dependencies-form></property-dependencies-form>')
      .boundTo({});
    component.bootstrap(configure);

    let firstName: HTMLInputElement;
    let lastName: HTMLInputElement;
    let number1: HTMLInputElement;
    let number2: HTMLInputElement;
    let password: HTMLInputElement;
    let confirmPassword: HTMLInputElement;

    let viewModel: PropertyDependenciesForm;

    const renderer = { render: jasmine.createSpy() };

    component.create(bootstrap as any)
      // grab some references.
      .then(() => {
        viewModel = component.viewModel;
        viewModel.controller.addRenderer(renderer);
        viewModel.controller.validateTrigger = validateTrigger.change;
        firstName = component.element.querySelector('#firstName') as HTMLInputElement;
        lastName = component.element.querySelector('#lastName') as HTMLInputElement;
        number1 = component.element.querySelector('#number1') as HTMLInputElement;
        number2 = component.element.querySelector('#number2') as HTMLInputElement;
        password = component.element.querySelector('#password') as HTMLInputElement;
        confirmPassword = component.element.querySelector('#confirmPassword') as HTMLInputElement;
      })
      // initially there should not be any errors
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => change(password, 'b'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      .then(() => expect(viewModel.controller.errors[0].message).toBe('Confirm Password must match Password'))
      .then(() => change(confirmPassword, 'b'))
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => change(confirmPassword, 'a'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      .then(() => expect(viewModel.controller.errors[0].message).toBe('Confirm Password must match Password'))
      .then(() => change(confirmPassword, 'b'))
      .then(() => viewModel.number1 = 1)
      // confirm the error was reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(2))
      // make a model change to the number2 field. 
      // this should reset the errors for the number2 field.
      .then(() => viewModel.number2 = 2)
      // confirm the error was reset.
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      // .then(() => {
      //   viewModel.number1 = 0;
      //   viewModel.number2 = 0;
      //   viewModel.password = 'a';
      //   viewModel.confirmPassword = 'a';
      //   viewModel.controller.reset();
      // })
      // make the passwords mismatch.

      // cleanup and finish.
      .then(() => component.dispose())
      .then(done);
  });
});
