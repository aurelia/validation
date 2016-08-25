"use strict";
var aurelia_dependency_injection_1 = require('aurelia-dependency-injection');
var aurelia_task_queue_1 = require('aurelia-task-queue');
var validation_controller_1 = require('./validation-controller');
var validate_trigger_1 = require('./validate-trigger');
/**
 * Binding behavior. Indicates the bound property should be validated.
 */
var ValidateBindingBehavior = (function () {
    function ValidateBindingBehavior(taskQueue) {
        this.taskQueue = taskQueue;
    }
    /**
    * Gets the DOM element associated with the data-binding. Most of the time it's
    * the binding.target but sometimes binding.target is an aurelia custom element,
    * which is a javascript "class" instance, so we need to use the controller to
    * locate the actual DOM element.
    */
    ValidateBindingBehavior.prototype.getTarget = function (binding, view) {
        var target = binding.target;
        if (target instanceof Element) {
            return target;
        }
        var controller;
        for (var id in view.controllers) {
            controller = view.controllers[id];
            if (controller.viewModel === target) {
                break;
            }
        }
        return controller.view.firstChild.parentNode;
    };
    ValidateBindingBehavior.prototype.bind = function (binding, source, rulesOrController, rules) {
        var _this = this;
        // identify the target element.
        var target = this.getTarget(binding, source);
        // locate the controller.
        var controller;
        if (rulesOrController instanceof validation_controller_1.ValidationController) {
            controller = rulesOrController;
        }
        else {
            controller = source.container.get(aurelia_dependency_injection_1.Optional.of(validation_controller_1.ValidationController));
            rules = rulesOrController;
        }
        if (controller === null) {
            throw new Error("A ValidationController has not been registered.");
        }
        controller.registerBinding(binding, target, rules);
        binding.validationController = controller;
        if (controller.validateTrigger === validate_trigger_1.validateTrigger.change) {
            binding.standardUpdateSource = binding.updateSource;
            binding.updateSource = function (value) {
                this.standardUpdateSource(value);
                this.validationController.validateBinding(this);
            };
        }
        else if (controller.validateTrigger === validate_trigger_1.validateTrigger.blur) {
            binding.validateBlurHandler = function () {
                _this.taskQueue.queueMicroTask(function () { return controller.validateBinding(binding); });
            };
            binding.validateTarget = target;
            target.addEventListener('blur', binding.validateBlurHandler);
        }
        if (controller.validateTrigger !== validate_trigger_1.validateTrigger.manual) {
            binding.standardUpdateTarget = binding.updateTarget;
            binding.updateTarget = function (value) {
                this.standardUpdateTarget(value);
                this.validationController.resetBinding(this);
            };
        }
    };
    ValidateBindingBehavior.prototype.unbind = function (binding) {
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
    };
    ValidateBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    return ValidateBindingBehavior;
}());
exports.ValidateBindingBehavior = ValidateBindingBehavior;
