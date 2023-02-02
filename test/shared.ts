import { Aurelia, FrameworkConfiguration } from 'aurelia-framework';
import { DOM, PLATFORM } from 'aurelia-pal';
import { configure as configureValidation } from '../src/aurelia-validation';
// import { configure as configureTestResources } from './resources/index';

export function configure(aurelia: Aurelia): FrameworkConfiguration {
  return aurelia.use
    .defaultBindingLanguage()
    .defaultResources()
    .plugin(configureValidation)
    // lazy loading this to avoid errors with rules being defined too early,
    // before validation parser has a chance to initialize
    .plugin(PLATFORM.moduleName('test/resources/index', 'resources'))
}

export function blur(element: Element): Promise<void> {
  element.dispatchEvent(DOM.createCustomEvent('blur', {}));
  return new Promise<void>(resolve => setTimeout(resolve));
}

export function focusout(element: Element): Promise<void> {
  element.dispatchEvent(DOM.createCustomEvent('focusout', { bubbles: true }));
  return new Promise<void>(resolve => setTimeout(resolve));
}

export function change(element: HTMLInputElement, value: string): Promise<void> {
  element.value = value;
  element.dispatchEvent(DOM.createCustomEvent('change', { bubbles: true }));
  return new Promise<void>(resolve => setTimeout(resolve));
}
