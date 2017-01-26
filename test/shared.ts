import { Aurelia } from 'aurelia-framework';
import { DOM } from 'aurelia-pal';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    // .developmentLogging()
    .plugin('dist/test/src/aurelia-validation')
    .feature('./dist/test/test/resources');
}

export function blur(element: Element): Promise<void> {
  element.dispatchEvent(DOM.createCustomEvent('blur', {}));
  return timeout();
}

export function change(element: HTMLInputElement, value: string): Promise<void> {
  element.value = value;
  element.dispatchEvent(DOM.createCustomEvent('change', { bubbles: true }));
  return timeout();
}

export function timeout(milliseconds: number = 0): Promise<void> {
  return new Promise<void>((resolve) => { setTimeout(() => { resolve(); }, milliseconds); });
}
