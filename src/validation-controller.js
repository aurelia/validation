import {inject} from 'aurelia-dependency-injection';
import {Validator} from './validator';
import {validateTrigger} from './validate-trigger';
import {getPropertyInfo} from './property-info';

@inject(Validator)
export class ValidationController {
  bindings = new Map();
  renderers = [];
  validateTrigger = validateTrigger.blur;

  constructor(validator) {
    this.validator = validator;
  }

  /**
  * Adds a renderer.
  * @param renderer The renderer.
  */
  addRenderer(renderer: ValidationRenderer) {
    for (let { target, errors } of this.bindings.values()) {
      for (let i = 0, ii = errors.length; i < ii; i++) {
        renderer.render(errors[i], target);
      }
    }
    this.renderers.push(renderer);
  }

  /**
  * Removes a renderer.
  * @param renderer The renderer.
  */
  removeRenderer(renderer: ValidationRenderer) {
    for (let { target, errors } of this.bindings.values()) {
      for (let i = 0, ii = errors.length; i < ii; i++) {
        renderer.unrender(errors[i], target);
      }
    }
    this.renderers.splice(this.renderers.indexOf(renderer), 1);
  }

  /**
  * Registers a binding with the controller.
  * @param binding The binding instance.
  * @param target The DOM element.
  * @param rules (optional) rules associated with the binding. Validator implementation specific.
  */
  registerBinding(binding, target, rules = null) {
    const errors = [];
    this.bindings.set(binding, { target, rules, errors });
  }

  /**
  * Unregisters a binding with the controller.
  * @param binding The binding instance.
  */
  unregisterBinding(binding) {
    this._resetBinding(binding);
    this.bindings.delete(binding);
  }

  /**
  * Validates all bindings and renders any validation errors.
  */
  validate() {
    const errors = [];
    for (let binding of this.bindings.keys()) {
      errors.splice(errors.length, 0, ...this._validateBinding(binding));
    }
    return errors;
  }

  /**
  * Resets all renderers (clears all the validation errors).
  */
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

  /*
  * Reconciles a binding's existing errors array with the new errors array.
  * Renders errors related to newly broken rules.  Unrenders errors related to
  * rules that are no longer broken.
  */
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

  /**
  * Validates and renders errors for a particular binding.
  */
  _validateBinding(binding) {
    const { target, rules, errors } = this.bindings.get(binding);
    const { object, property } = getPropertyInfo(binding.sourceExpression, binding.source);
    const newErrors = this.validator.validateProperty(object, property, rules);
    this._updateErrors(errors, newErrors, target);
    return errors;
  }

  /**
  * Resets and unrenders errors for a particular binding.
  */
  _resetBinding(binding) {
    const { target, errors } = this.bindings.get(binding);
    this._updateErrors(errors, [], target);
  }
}
