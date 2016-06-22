define(['exports', 'aurelia-dependency-injection', 'aurelia-task-queue', './validation-controller', './validate-trigger'], function (exports, _aureliaDependencyInjection, _aureliaTaskQueue, _validationController, _validateTrigger) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ValidateBindingBehavior = undefined;

  

  var _dec, _class;

  var ValidateBindingBehavior = exports.ValidateBindingBehavior = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaTaskQueue.TaskQueue), _dec(_class = function () {
    function ValidateBindingBehavior(taskQueue) {
      

      this.taskQueue = taskQueue;
    }

    ValidateBindingBehavior.prototype.getTarget = function getTarget(binding, view) {
      var target = binding.target;
      if (target instanceof Element) {
        return target;
      }
      var controller = void 0;
      for (var id in view.controllers) {
        controller = view.controllers[id];
        if (controller.viewModel === target) {
          break;
        }
      }
      return controller.view.firstChild.parentNode;
    };

    ValidateBindingBehavior.prototype.bind = function bind(binding, source, rules) {
      var _this = this;

      var target = this.getTarget(binding, source);

      var controller = source.container.get(_aureliaDependencyInjection.Optional.of(_validationController.ValidationController, true));
      if (controller === null) {
        throw new Error('A ValidationController has not been registered.');
      }
      controller.registerBinding(binding, target, rules);
      binding.validationController = controller;

      if (controller.validateTrigger === _validateTrigger.validateTrigger.change) {
        binding.standardUpdateSource = binding.updateSource;
        binding.updateSource = function (value) {
          this.standardUpdateSource(value);
          this.validationController._validateBinding(this);
        };
      } else if (controller.validateTrigger === _validateTrigger.validateTrigger.blur) {
        binding.validateBlurHandler = function () {
          _this.taskQueue.queueMicroTask(function () {
            return controller._validateBinding(binding);
          });
        };
        binding.validateTarget = target;
        target.addEventListener('blur', binding.validateBlurHandler);
      }

      if (controller.validateTrigger !== _validateTrigger.validateTrigger.manual) {
        binding.standardUpdateTarget = binding.updateTarget;
        binding.updateTarget = function (value) {
          this.standardUpdateTarget(value);
          this.validationController._resetBinding(this);
        };
      }
    };

    ValidateBindingBehavior.prototype.unbind = function unbind(binding, source) {
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
    };

    return ValidateBindingBehavior;
  }()) || _class);
});