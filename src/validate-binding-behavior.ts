import {Optional} from 'aurelia-dependency-injection';
import {DOM} from 'aurelia-pal';
import {TaskQueue} from 'aurelia-task-queue';
import {ValidationController} from './validation-controller';
import {validateTrigger} from './validate-trigger';

/**
 * Binding behavior. Indicates the bound property should be validated.
 */
export class ValidateBindingBehavior {
  static inject = [TaskQueue];

  constructor(private taskQueue: TaskQueue) {}

  /**
  * Gets the DOM element associated with the data-binding. Most of the time it's
  * the binding.target but sometimes binding.target is an aurelia custom element,
  * or custom attribute which is a javascript "class" instance, so we need to use
  * the controller's container to retrieve the actual DOM element.
  */
  getTarget(binding: any, view: any) {
    const target = binding.target;
    // DOM element
    if (target instanceof Element) {
      return target;
    }
    // custom element or custom attribute
    for (let i = 0, ii = view.controllers.length; i < ii; i++) {
      let controller: any = view.controllers[i];
      if (controller.viewModel === target) {
        const element = controller.container.get(DOM.Element);
        if (element) {
          return element;
        }
        throw new Error(`Unable to locate target element for "${binding.sourceExpression}".`);
      }
    }
    throw new Error(`Unable to locate target element for "${binding.sourceExpression}".`);
  }

  bind(binding: any, source: any, rulesOrController?: ValidationController|any, rules?: any) {
    // identify the target element.
    const target = this.getTarget(binding, source);

    // locate the controller.
    let controller: ValidationController;
    if (rulesOrController instanceof ValidationController) {
      controller = rulesOrController;
    } else {
      controller = source.container.get(Optional.of(ValidationController));
      rules = rulesOrController;
    }     
    if (controller === null) {
      throw new Error(`A ValidationController has not been registered.`);
    }

    controller.registerBinding(binding, target, rules);
    binding.validationController = controller;

    if (controller.validateTrigger === validateTrigger.change
      || controller.validateTrigger === validateTrigger.changeOrBlur) {
      binding.standardUpdateSource = binding.updateSource;
      binding.updateSource = function(value: any) {
        this.standardUpdateSource(value);
        this.validationController.validateBinding(this);
      };
    }
    
    if (controller.validateTrigger === validateTrigger.blur
      || controller.validateTrigger === validateTrigger.changeOrBlur) {
      binding.validateBlurHandler = () => {
        this.taskQueue.queueMicroTask(() => controller.validateBinding(binding));
      };
      binding.validateTarget = target;
      target.addEventListener('blur', binding.validateBlurHandler);
    }

    if (controller.validateTrigger !== validateTrigger.manual) {
      binding.standardUpdateTarget = binding.updateTarget;
      binding.updateTarget = function(value: any) {
        this.standardUpdateTarget(value);
        this.validationController.resetBinding(this);
      };
    }
  }

  unbind(binding: any) {
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
