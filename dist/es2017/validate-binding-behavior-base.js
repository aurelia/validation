import { Optional } from 'aurelia-dependency-injection';
import { ValidationController } from './validation-controller';
import { validateTrigger } from './validate-trigger';
import { getTargetDOMElement } from './get-target-dom-element';
/**
 * Binding behavior. Indicates the bound property should be validated.
 */
export class ValidateBindingBehaviorBase {
    constructor(taskQueue) {
        this.taskQueue = taskQueue;
    }
    bind(binding, source, rulesOrController, rules) {
        // identify the target element.
        const target = getTargetDOMElement(binding, source);
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
        const trigger = this.getValidateTrigger(controller);
        // tslint:disable-next-line:no-bitwise
        if (trigger & validateTrigger.change) {
            binding.standardUpdateSource = binding.updateSource;
            // tslint:disable-next-line:only-arrow-functions
            // tslint:disable-next-line:space-before-function-paren
            binding.updateSource = function (value) {
                this.standardUpdateSource(value);
                this.validationController.validateBinding(this);
            };
        }
        // tslint:disable-next-line:no-bitwise
        if (trigger & validateTrigger.blur) {
            binding.validateBlurHandler = () => {
                this.taskQueue.queueMicroTask(() => controller.validateBinding(binding));
            };
            binding.validateTarget = target;
            target.addEventListener('blur', binding.validateBlurHandler);
        }
        if (trigger !== validateTrigger.manual) {
            binding.standardUpdateTarget = binding.updateTarget;
            // tslint:disable-next-line:only-arrow-functions
            // tslint:disable-next-line:space-before-function-paren
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
