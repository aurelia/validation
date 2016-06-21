var _dec, _class;

import { inject } from 'aurelia-dependency-injection';
import { Validator } from './validator';
import { validateTrigger } from './validate-trigger';
import { getPropertyInfo } from './property-info';

export let ValidationController = (_dec = inject(Validator), _dec(_class = class ValidationController {

  constructor(validator) {
    this.bindings = new Map();
    this.renderers = [];
    this.validateTrigger = validateTrigger.blur;

    this.validator = validator;
  }

  addRenderer(renderer) {
    for (let { target, errors } of this.bindings.values()) {
      for (let i = 0, ii = errors.length; i < ii; i++) {
        renderer.render(errors[i], target);
      }
    }
    this.renderers.push(renderer);
  }

  removeRenderer(renderer) {
    for (let { target, errors } of this.bindings.values()) {
      for (let i = 0, ii = errors.length; i < ii; i++) {
        renderer.unrender(errors[i], target);
      }
    }
    this.renderers.splice(this.renderers.indexOf(renderer), 1);
  }

  registerBinding(binding, target, rules = null) {
    const errors = [];
    this.bindings.set(binding, { target, rules, errors });
  }

  unregisterBinding(binding) {
    this._resetBinding(binding);
    this.bindings.delete(binding);
  }

  validate() {
    const errors = [];
    for (let binding of this.bindings.keys()) {
      errors.splice(errors.length, 0, ...this._validateBinding(binding));
    }
    return errors;
  }

  reset() {
    for (let binding of this.bindings.keys()) {
      this._resetBinding(binding);
    }
  }

  _renderError(error, target) {
    const renderers = this.renderers;
    let i = renderers.length;
    while (i--) {
      renderers[i].render(error, target);
    }
  }

  _unrenderError(error, target) {
    const renderers = this.renderers;
    let i = renderers.length;
    while (i--) {
      renderers[i].unrender(error, target);
    }
  }

  _updateErrors(errors, newErrors, target) {
    let error;
    while (error = errors.pop()) {
      this._unrenderError(error, target);
    }
    for (let i = 0, ii = newErrors.length; i < ii; i++) {
      error = newErrors[i];
      errors.push(error);
      this._renderError(error, target);
    }
  }

  _validateBinding(binding) {
    const { target, rules, errors } = this.bindings.get(binding);
    const { object, property } = getPropertyInfo(binding.sourceExpression, binding.source);
    const newErrors = this.validator.validateProperty(object, property, rules);
    this._updateErrors(errors, newErrors, target);
    return errors;
  }

  _resetBinding(binding) {
    const { target, errors } = this.bindings.get(binding);
    this._updateErrors(errors, [], target);
  }
}) || _class);