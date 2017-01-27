import { StageComponent, ComponentTester } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PropertyDependenciesForm } from './resources/property-dependencies-form';
import { configure, change } from './shared';

describe('use of satisfies tagged rule', () => {
  it('new API is backwards compatible', (done: () => void) => {
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
        firstName = component.element.querySelector('#firstName') as HTMLInputElement;
        lastName = component.element.querySelector('#lastName') as HTMLInputElement;
        number1 = component.element.querySelector('#number1') as HTMLInputElement;
        number2 = component.element.querySelector('#number2') as HTMLInputElement;
        password = component.element.querySelector('#password') as HTMLInputElement;
        confirmPassword = component.element.querySelector('#confirmPassword') as HTMLInputElement;
        viewModel.password = 'a';
      })
      // initially there should not be any errors
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => change(password, ''))
      .then(() => {
        expect(viewModel.controller.errors.length).toBe(1);
      })
      .then(() => {
        expect(viewModel.controller.errors[0].message).toBe('Password is required.');
      })
      .then(() => change(password, 'b'))
      .then(() => change(confirmPassword, 'b'))
      .then(() => change(confirmPassword, 'b'))
      .then(() => expect(viewModel.controller.errors.length).toBe(0))
      .then(() => change(confirmPassword, 'a'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      .then(() => expect(viewModel.controller.errors[0].message).toBe('Confirm Password must match Password'))
      .then(() => change(number1, '1'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1))
      .then(() => change(confirmPassword, 'b'))
      .then(() => change(number2, '2'))
      // .then(() => {
      //   viewModel.controller.validate({ object: viewModel });
      //   return timeout();
      // })
      .then(() => expect(viewModel.controller.errors.length).toBe(2))
      .then(() => expect(viewModel.controller.errors[0].message).toBe('numbers must be equal to 1 and 2'))
      .then(() => expect(viewModel.controller.errors[1].message).toBe('numbers must be equal to 1 and 2'))

      // cleanup and finish.
      .then(() => component.dispose())
      .then(done);
  });
});
