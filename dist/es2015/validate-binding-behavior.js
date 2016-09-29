import { TaskQueue } from 'aurelia-task-queue';
import { validateTrigger } from './validate-trigger';
import { ValidateBindingBehaviorBase } from './validate-binding-behavior-base';
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the validate trigger specified by the associated controller's
 * validateTrigger property occurs.
 */
export class ValidateBindingBehavior extends ValidateBindingBehaviorBase {
    getValidateTrigger(controller) {
        return controller.validateTrigger;
    }
}
ValidateBindingBehavior.inject = [TaskQueue];
/**
 * Binding behavior. Indicates the bound property will be validated
 * manually, by calling controller.validate(). No automatic validation
 * triggered by data-entry or blur will occur.
 */
export class ValidateManuallyBindingBehavior extends ValidateBindingBehaviorBase {
    getValidateTrigger() {
        return validateTrigger.manual;
    }
}
ValidateManuallyBindingBehavior.inject = [TaskQueue];
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs.
 */
export class ValidateOnBlurBindingBehavior extends ValidateBindingBehaviorBase {
    getValidateTrigger() {
        return validateTrigger.blur;
    }
}
ValidateOnBlurBindingBehavior.inject = [TaskQueue];
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element is changed by the user, causing a change
 * to the model.
 */
export class ValidateOnChangeBindingBehavior extends ValidateBindingBehaviorBase {
    getValidateTrigger() {
        return validateTrigger.change;
    }
}
ValidateOnChangeBindingBehavior.inject = [TaskQueue];
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs or is changed by the user, causing
 * a change to the model.
 */
export class ValidateOnChangeOrBlurBindingBehavior extends ValidateBindingBehaviorBase {
    getValidateTrigger() {
        return validateTrigger.changeOrBlur;
    }
}
ValidateOnChangeOrBlurBindingBehavior.inject = [TaskQueue];
