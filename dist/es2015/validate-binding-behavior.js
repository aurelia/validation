import { Optional } from 'aurelia-dependency-injection';
import { TaskQueue } from 'aurelia-task-queue';
import { ValidationController } from './validation-controller';
import { validateTrigger } from './validate-trigger';
/**
 * Binding behavior. Indicates the bound property should be validated.
 */
export class ValidateBindingBehavior {
    constructor(taskQueue) {
        this.taskQueue = taskQueue;
    }
    /**
    * Gets the DOM element associated with the data-binding. Most of the time it's
    * the binding.target but sometimes binding.target is an aurelia custom element,
    * which is a javascript "class" instance, so we need to use the controller to
    * locate the actual DOM element.
    */
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
        return controller.view.firstChild.parentNode;
    }
    bind(binding, source, rulesOrController, rules) {
        // identify the target element.
        const target = this.getTarget(binding, source);
        // locate the controller.
        let controller;
        if (rulesOrController instanceof ValidationController) {
            controller = rulesOrController;
        }
        else {
            controller = source.container.get(Optional.of(ValidationController));
            rules = rulesOrController;
        }
        if (controller === null) {
            throw new Error(`A ValidationController has not been registered.`);
        }
        controller.registerBinding(binding, target, rules);
        binding.validationController = controller;
        if (controller.validateTrigger === validateTrigger.change) {
            binding.standardUpdateSource = binding.updateSource;
            binding.updateSource = function (value) {
                this.standardUpdateSource(value);
                this.validationController.validateBinding(this);
            };
        }
        else if (controller.validateTrigger === validateTrigger.blur) {
            binding.validateBlurHandler = () => {
                this.taskQueue.queueMicroTask(() => controller.validateBinding(binding));
            };
            binding.validateTarget = target;
            target.addEventListener('blur', binding.validateBlurHandler);
        }
        if (controller.validateTrigger !== validateTrigger.manual) {
            binding.standardUpdateTarget = binding.updateTarget;
            binding.updateTarget = function (value) {
                this.standardUpdateTarget(value);
                this.validationController.resetBinding(this);
            };
        }
    }
    unbind(binding) {
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
ValidateBindingBehavior.inject = [TaskQueue];
