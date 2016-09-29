var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { TaskQueue } from 'aurelia-task-queue';
import { validateTrigger } from './validate-trigger';
import { ValidateBindingBehaviorBase } from './validate-binding-behavior-base';
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the validate trigger specified by the associated controller's
 * validateTrigger property occurs.
 */
export var ValidateBindingBehavior = (function (_super) {
    __extends(ValidateBindingBehavior, _super);
    function ValidateBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateBindingBehavior.prototype.getValidateTrigger = function (controller) {
        return controller.validateTrigger;
    };
    ValidateBindingBehavior.inject = [TaskQueue];
    return ValidateBindingBehavior;
}(ValidateBindingBehaviorBase));
/**
 * Binding behavior. Indicates the bound property will be validated
 * manually, by calling controller.validate(). No automatic validation
 * triggered by data-entry or blur will occur.
 */
export var ValidateManuallyBindingBehavior = (function (_super) {
    __extends(ValidateManuallyBindingBehavior, _super);
    function ValidateManuallyBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateManuallyBindingBehavior.prototype.getValidateTrigger = function () {
        return validateTrigger.manual;
    };
    ValidateManuallyBindingBehavior.inject = [TaskQueue];
    return ValidateManuallyBindingBehavior;
}(ValidateBindingBehaviorBase));
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs.
 */
export var ValidateOnBlurBindingBehavior = (function (_super) {
    __extends(ValidateOnBlurBindingBehavior, _super);
    function ValidateOnBlurBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateOnBlurBindingBehavior.prototype.getValidateTrigger = function () {
        return validateTrigger.blur;
    };
    ValidateOnBlurBindingBehavior.inject = [TaskQueue];
    return ValidateOnBlurBindingBehavior;
}(ValidateBindingBehaviorBase));
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element is changed by the user, causing a change
 * to the model.
 */
export var ValidateOnChangeBindingBehavior = (function (_super) {
    __extends(ValidateOnChangeBindingBehavior, _super);
    function ValidateOnChangeBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateOnChangeBindingBehavior.prototype.getValidateTrigger = function () {
        return validateTrigger.change;
    };
    ValidateOnChangeBindingBehavior.inject = [TaskQueue];
    return ValidateOnChangeBindingBehavior;
}(ValidateBindingBehaviorBase));
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs or is changed by the user, causing
 * a change to the model.
 */
export var ValidateOnChangeOrBlurBindingBehavior = (function (_super) {
    __extends(ValidateOnChangeOrBlurBindingBehavior, _super);
    function ValidateOnChangeOrBlurBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateOnChangeOrBlurBindingBehavior.prototype.getValidateTrigger = function () {
        return validateTrigger.changeOrBlur;
    };
    ValidateOnChangeOrBlurBindingBehavior.inject = [TaskQueue];
    return ValidateOnChangeOrBlurBindingBehavior;
}(ValidateBindingBehaviorBase));
