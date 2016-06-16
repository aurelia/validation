var _dec, _class;

import { inject, Optional } from 'aurelia-dependency-injection';
import { TaskQueue } from 'aurelia-task-queue';
import { ValidationController } from './validation-controller';
import { validateTrigger } from './validate-trigger';

export let ValidateBindingBehavior = (_dec = inject(TaskQueue), _dec(_class = class ValidateBindingBehavior {
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
    const target = this.getTarget(binding, source);

    const controller = source.container.get(Optional.of(ValidationController, true));
    if (controller === null) {
      throw new Error('A ValidationController has not been registered.');
    }
    controller.registerBinding(binding, target, rules);
    binding.validationController = controller;

    if (controller.validateTrigger === validateTrigger.change) {
      binding.standardUpdateSource = binding.updateSource;
      binding.updateSource = function (value) {
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
      binding.updateTarget = function (value) {
        this.standardUpdateTarget(value);
        this.validationController._resetBinding(this);
      };
    }
  }

  unbind(binding, source) {
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
}) || _class);