import {inject, Optional} from 'aurelia-dependency-injection';
import {TaskQueue} from 'aurelia-task-queue';
import {ValidationController} from './validation-controller';
import {validateTrigger} from './validate-trigger';

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
    if (target.element && target.element instanceof Element) {
      return target.element;
    }

    let controller;
    for (let id in view.controllers) {
      controller = view.controllers[id];
      if (controller.viewModel === target) {
        break;
      }
    }
    return controller.view.firstChild.parentNode;
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
