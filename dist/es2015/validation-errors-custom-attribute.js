var _dec, _dec2, _class;

import { bindingMode } from 'aurelia-binding';
import { inject, Lazy } from 'aurelia-dependency-injection';
import { customAttribute } from 'aurelia-templating';
import { ValidationController } from './validation-controller';
import { validationRenderer } from './validation-renderer';

export let ValidationErrorsCustomAttribute = (_dec = customAttribute('validation-errors', bindingMode.twoWay), _dec2 = inject(Element, Lazy.of(ValidationController)), _dec(_class = _dec2(_class = validationRenderer(_class = class ValidationErrorsCustomAttribute {

  constructor(boundaryElement, controllerAccessor) {
    this.errors = [];

    this.boundaryElement = boundaryElement;
    this.controllerAccessor = controllerAccessor;
  }

  sort() {
    this.errors.sort((a, b) => {
      if (a.target === b.target) {
        return 0;
      }
      return a.target.compareDocumentPosition(b.target) & 2 ? 1 : -1;
    });
  }

  render(error, target) {
    if (!target || !(this.boundaryElement === target || this.boundaryElement.contains(target))) {
      return;
    }

    this.errors.push({ error, target });
    this.sort();
    this.value = this.errors;
  }

  unrender(error, target) {
    if (!target || !(this.boundaryElement === target || this.boundaryElement.contains(target))) {
      return;
    }

    const index = this.errors.findIndex(x => x.error === error);
    if (index === -1) {
      return;
    }
    this.errors.splice(index, 1);
    this.value = this.errors;
  }

  bind() {
    this.controllerAccessor().addRenderer(this);
    this.value = this.errors;
  }

  unbind() {
    this.controllerAccessor().removeRenderer(this);
  }
}) || _class) || _class) || _class);