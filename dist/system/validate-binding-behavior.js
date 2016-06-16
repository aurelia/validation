'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-task-queue', './validation-controller', './validate-trigger'], function (_export, _context) {
  "use strict";

  var inject, Optional, TaskQueue, ValidationController, validateTrigger, _dec, _class, ValidateBindingBehavior;

  

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
      Optional = _aureliaDependencyInjection.Optional;
    }, function (_aureliaTaskQueue) {
      TaskQueue = _aureliaTaskQueue.TaskQueue;
    }, function (_validationController) {
      ValidationController = _validationController.ValidationController;
    }, function (_validateTrigger) {
      validateTrigger = _validateTrigger.validateTrigger;
    }],
    execute: function () {
      _export('ValidateBindingBehavior', ValidateBindingBehavior = (_dec = inject(TaskQueue), _dec(_class = function () {
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
          return controller.view.firstChild.parentElement;
        };

        ValidateBindingBehavior.prototype.bind = function bind(binding, source, rules) {
          var _this = this;

          var target = this.getTarget(binding, source);

          var controller = source.container.get(Optional.of(ValidationController, true));
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
            binding.validateBlurHandler = function () {
              _this.taskQueue.queueMicroTask(function () {
                return controller._validateBinding(binding);
              });
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
      }()) || _class));

      _export('ValidateBindingBehavior', ValidateBindingBehavior);
    }
  };
});