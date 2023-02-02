import './setup';
import { StageComponent, ComponentTester } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { TriggerForm } from './resources/trigger-form';
import { configure, blur, change, focusout } from './shared';

describe('ValidateBindingBehavior', () => {
  it('sets validateTrigger', (done: () => void) => {
    const component: ComponentTester = StageComponent
      .withResources()
      .inView('<trigger-form></trigger-form>')
      .boundTo({});
    component.bootstrap(configure);

    let viewModel: TriggerForm;

    const renderer = { render: jasmine.createSpy() };

    component.create(bootstrap)
      // grab some references.
      .then(() => {
        viewModel = component.viewModel;
        viewModel.controller.addRenderer(renderer);
      })
      // standard validate binding behavior
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error1'))
      .then(() => blur(viewModel.standardInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error2'))
      .then(() => change(viewModel.standardInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error3'))
      .then(() => blur(viewModel.standardInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error4'))

      // validateOnBlur binding behavior
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error5'))
      .then(() => blur(viewModel.blurInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error6'))
      .then(() => change(viewModel.blurInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error7'))
      .then(() => blur(viewModel.blurInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error8'))

      // validateOnFocusout binding behavior - native input
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error5.1'))
      .then(() => focusout(viewModel.focusoutInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error6.1'))
      .then(() => change(viewModel.focusoutInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error7.1'))
      .then(() => focusout(viewModel.focusoutInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error8.1'))

      // validateOnFocusout binding behavior - custom element
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error5.2'))
      .then(() => focusout(viewModel.focusoutCustomInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error6.2'))
      .then(() => change(viewModel.focusoutCustomInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error7.2'))
      .then(() => focusout(viewModel.focusoutCustomInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error8.2'))

      // validateOnChange binding behavior
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error9'))
      .then(() => blur(viewModel.changeInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error10'))
      .then(() => change(viewModel.changeInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error11'))
      .then(() => change(viewModel.changeInput, ''))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error12'))
      .then(() => change(viewModel.changeInput, 'test2'))
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error13'))

      // validateOnChangeOrBlur binding behavior
      .then(() => change(viewModel.changeInput, '')) // make one error
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error14'))
      .then(() => blur(viewModel.changeOrBlurInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error15'))
      .then(() => change(viewModel.changeOrBlurInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error16'))
      .then(() => blur(viewModel.changeOrBlurInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(2, 'error17'))
      .then(() => change(viewModel.changeOrBlurInput, 'foo'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error18'))
      .then(() => change(viewModel.changeInput, 'adsf')) // clear the one error
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error19'))

      // validateOnChangeOrFocusout binding behavior - native input
      .then(() => change(viewModel.changeInput, '')) // make one error
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error14.1'))
      .then(() => focusout(viewModel.changeOrFocusoutInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error15.1'))
      .then(() => change(viewModel.changeOrFocusoutInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error16.1'))
      .then(() => focusout(viewModel.changeOrFocusoutInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(2, 'error17.1'))
      .then(() => change(viewModel.changeOrFocusoutInput, 'foo'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error18.1'))
      .then(() => change(viewModel.changeInput, 'adsf')) // clear the one error
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error19.1'))

      // validateOnChangeOrFocusout binding behavior - custom element
      .then(() => change(viewModel.changeInput, '')) // make one error
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error14.2'))
      .then(() => focusout(viewModel.changeOrFocusoutCustomInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error15.2'))
      .then(() => change(viewModel.changeOrFocusoutCustomInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error16.3'))
      .then(() => focusout(viewModel.changeOrFocusoutCustomInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(2, 'error17.4'))
      .then(() => change(viewModel.changeOrFocusoutCustomInput, 'foo'))
      .then(() => expect(viewModel.controller.errors.length).toBe(1, 'error18.5'))
      .then(() => change(viewModel.changeInput, 'adsf')) // clear the one error
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error19.6'))

      // validateManually binding behavior
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error20'))
      .then(() => blur(viewModel.manualInput))
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error21'))
      .then(() => change(viewModel.manualInput, 'test'))
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error22'))
      .then(() => change(viewModel.manualInput, ''))
      .then(() => expect(viewModel.controller.errors.length).toBe(0, 'error23'))

      // cleanup and finish.
      .then(() => component.dispose())
      .then(() => done());
  });
});
