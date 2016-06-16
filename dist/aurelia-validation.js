import {AccessMember,AccessScope,AccessKeyed,BindingBehavior,ValueConverter,bindingMode} from 'aurelia-binding';
import {protocol} from 'aurelia-metadata';
import {inject,Optional,Lazy} from 'aurelia-dependency-injection';
import {TaskQueue} from 'aurelia-task-queue';
import {customAttribute} from 'aurelia-templating';

export class ValidationError {
  /**
  * The rule associated with the error.  Validator implementation specific.
  * Can be considered a unique key.
  */
  rule: any;

  /**
  * The error message.
  */
  message: string;

  /**
  * The object associated with the error.
  */
  object: any;

  /**
  * The property associated with the error.  May be null.
  */
  propertyName: string;

  constructor(rule, message, object, propertyName = null) {
    this.rule = rule;
    this.message = message;
    this.object = object;
    this.propertyName = propertyName || null;
  }
}

/**
* Validation triggers.
*/
export const validateTrigger = {
  /**
  * Validate the binding when the binding's target element fires a DOM "blur" event.
  */
  blur: 'blur',

  /**
  * Validate the binding when it updates the model due to a change in the view.
  * Not specific to DOM "change" events.
  */
  change: 'change',

  /**
  * Manual validation.  Use the controller's `validate()` and  `reset()` methods
  * to validate all bindings.
  */
  manual: 'manual'
};

function getObject(expression, objectExpression, source) {
  let value = objectExpression.evaluate(source);
  if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
    return value;
  }
  if (value === null) {
    value = 'null';
  } else if (value === undefined) {
    value = 'undefined';
  }
  throw new Error(`The '${objectExpression}' part of '${expression}' evaluates to ${value} instead of an object.`);
}

export function getPropertyInfo(expression, source) {
  const originalExpression = expression;
  while (expression instanceof BindingBehavior || expression instanceof ValueConverter) {
    expression = expression.expression;
  }

  let object;
  let property;
  if (expression instanceof AccessScope) {
    object = source.bindingContext;
    property = expression.name;
  } else if (expression instanceof AccessMember) {
    object = getObject(originalExpression, expression.object, source);
    property = expression.name;
  } else if (expression instanceof AccessKeyed) {
    object = getObject(originalExpression, expression.object, source);
    property = expression.key.evaluate(source);
  } else {
    throw new Error(`Expression '${originalExpression}' is not compatible with the validate binding-behavior.`);
  }

  return { object, property };
}

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

export class Validator {
  validateProperty(object, propertyName, rules = null): ValidationError[] {
    throw new Error('A Validator must implement validateProperty');
  }

  validateObject(object, rules = null): ValidationError[] {
    throw new Error('A Validator must implement validateObject');
  }
}

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
    let i = 0;
    while (i < errors.length) {
      const error = errors[i];
      const index = newErrors.findIndex(x => x.rule === error.rule);
      if (index === -1) {
        errors.splice(i, 1);
        this._unrenderError(error, target);
        continue;
      }
      newErrors.splice(index, 1);
      i++;
    }
    i = 0;
    while (i < newErrors.length) {
      const error = newErrors[i];
      errors.push(error);
      this._renderError(error, target);
      i++;
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

@inject(TaskQueue)
export class ValidateBindingBehavior {
  constructor(taskQueue) {
    this.taskQueue = taskQueue;
  }

  getTarget(binding, view) {
    const target = binding.target;
    if (target instanceof Element) {
      return target;
    }
    let controller;
    for (let id in view.controllers) {
      controller = view.controllers[id];
      if (controller.viewModel === target) {
        break;
      }
    }
    return controller.view.firstChild.parentElement;
  }

  bind(binding, source, rules) {
    // identify the target element.
    const target = this.getTarget(binding, source);

    // locate the controller.
    const controller = source.container.get(Optional.of(ValidationController, true));
    if (controller === null) {
      throw new Error('A ValidationController has not been registered.');
    }
    controller.registerBinding(binding, target, rules);
    binding.validationController = controller;

    if (controller.validateTrigger === validateTrigger.change) {
      binding.standardUpdateSource = binding.updateSource;
      binding.updateSource = function(value) {
        this.standardUpdateSource(value);
        this.validationController._validateBinding(this);
      };
    } else if (controller.validateTrigger === validateTrigger.blur) {
      binding.validateBlurHandler = () => {
        this.taskQueue.queueMicroTask(() => controller._validateBinding(binding));
      };
      binding.validateTarget = target;
      target.addEventListener('blur', binding.validateBlurHandler);
    }

    if (controller.validateTrigger !== validateTrigger.manual) {
      binding.standardUpdateTarget = binding.updateTarget;
      binding.updateTarget = function(value) {
        this.standardUpdateTarget(value);
        this.validationController._resetBinding(this);
      };
    }
  }

  unbind(binding, source) {
    // reset the binding to it's original state.
    if (binding.standardUpdateSource) {
      binding.updateSource = binding.standardUpdateSource;
      binding.standardUpdateSource = null;
    }
    if (binding.standardUpdateTarget) {
      binding.updateTarget = binding.standardUpdateTarget;
      binding.standardUpdateTarget = null;
    }
    if (binding.validateBlurHandler) {
      binding.validateTarget.removeEventListener('blur', binding.validateBlurHandler);
      binding.validateBlurHandler = null;
      binding.validateTarget = null;
    }
    binding.validationController.unregisterBinding(binding);
    binding.validationController = null;
  }
}

@customAttribute('validation-errors', bindingMode.twoWay)
@inject(Element, Lazy.of(ValidationController))
@validationRenderer
export class ValidationErrorsCustomAttribute {
  errors = [];

  constructor(boundaryElement, controllerAccessor) {
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
}

export class ValidationRendererCustomAttribute {
  created(view) {
    this.container = view.container;
  }

  bind() {
    this.controller = this.container.get(ValidationController);
    this.renderer = this.container.get(this.value);
    this.controller.addRenderer(this.renderer);
  }

  unbind() {
    this.controller.removeRenderer(this.renderer);
    this.controller = null;
    this.renderer = null;
  }
}
