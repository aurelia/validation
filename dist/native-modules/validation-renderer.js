import { protocol } from 'aurelia-metadata';

export var validationRenderer = protocol.create('aurelia:validation-renderer', function (target) {
  if (!(typeof target.render === 'function')) {
    return 'Validation renderers must implement: render(error: ValidationError, target: Element): void';
  }

  if (!(typeof target.unrender === 'function')) {
    return 'Validation renderers must implement: unrender(error: ValidationError, target: Element): void';
  }

  return true;
});