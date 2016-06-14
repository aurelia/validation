import {protocol} from 'aurelia-metadata';
import {ValidationError} from './validation-error';

/**
* Decorator: Indicates that the decorated class/object is a validation-renderer.
*/
export const validationRenderer: Function = protocol.create('aurelia:validation-renderer', function(target) {
  if (!(typeof target.render === 'function')) {
    return 'Validation renderers must implement: render(error: ValidationError, target: Element): void';
  }

  if (!(typeof target.unrender === 'function')) {
    return 'Validation renderers must implement: unrender(error: ValidationError, target: Element): void';
  }

  return true;
});

interface ValidationRenderer {
  render(error: ValidationError, target: Element): void;
  unrender(error: ValidationError, target: Element): void
}
