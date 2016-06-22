import {
  AccessMember,
  AccessScope,
  AccessKeyed,
  BindingBehavior,
  ValueConverter,
  bindingMode
} from 'aurelia-binding';
import {
  protocol
} from 'aurelia-metadata';
import {
  inject,
  Optional,
  Lazy
} from 'aurelia-dependency-injection';
import {
  TaskQueue
} from 'aurelia-task-queue';
import {
  customAttribute
} from 'aurelia-templating';
export declare interface ValidationRenderer {
  render(error: ValidationError, target: Element): void;
  unrender(error: ValidationError, target: Element): void;
}
export declare class ValidationError {
  
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
  constructor(rule?: any, message?: any, object?: any, propertyName?: any);
}

/**
* Validation triggers.
*/
export declare const validateTrigger: any;
export declare function getPropertyInfo(expression?: any, source?: any): any;

/**
* Decorator: Indicates that the decorated class/object is a validation-renderer.
*/
export declare const validationRenderer: Function;
export declare class Validator {
  validateProperty(object?: any, propertyName?: any, rules?: any): ValidationError[];
  validateObject(object?: any, rules?: any): ValidationError[];
}
export declare class ValidationController {
  bindings: any;
  renderers: any;
  validateTrigger: any;
  constructor(validator?: any);
  
  /**
    * Adds a renderer.
    * @param renderer The renderer.
    */
  addRenderer(renderer: ValidationRenderer): any;
  
  /**
    * Removes a renderer.
    * @param renderer The renderer.
    */
  removeRenderer(renderer: ValidationRenderer): any;
  
  /**
    * Registers a binding with the controller.
    * @param binding The binding instance.
    * @param target The DOM element.
    * @param rules (optional) rules associated with the binding. Validator implementation specific.
    */
  registerBinding(binding?: any, target?: any, rules?: any): any;
  
  /**
    * Unregisters a binding with the controller.
    * @param binding The binding instance.
    */
  unregisterBinding(binding?: any): any;
  
  /**
    * Validates all bindings and renders any validation errors.
    */
  validate(): any;
  
  /**
    * Resets all renderers (clears all the validation errors).
    */
  reset(): any;
}
export declare class ValidateBindingBehavior {
  constructor(taskQueue?: any);
  
  /**
    * Gets the DOM element associated with the data-binding. Most of the time it's
    * the binding.target but sometimes binding.target is an aurelia custom element,
    * which is a javascript "class" instance, so we need to use the controller to
    * locate the actual DOM element.
    */
  getTarget(binding?: any, view?: any): any;
  bind(binding?: any, source?: any, rules?: any): any;
  unbind(binding?: any, source?: any): any;
}
export declare class ValidationErrorsCustomAttribute {
  errors: any;
  constructor(boundaryElement?: any, controllerAccessor?: any);
  sort(): any;
  render(error?: any, target?: any): any;
  unrender(error?: any, target?: any): any;
  bind(): any;
  unbind(): any;
}
export declare class ValidationRendererCustomAttribute {
  created(view?: any): any;
  bind(): any;
  unbind(): any;
}