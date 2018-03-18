var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { TaskQueue } from 'aurelia-task-queue';
import { validateTrigger } from './validate-trigger';
import { ValidateBindingBehaviorBase } from './validate-binding-behavior-base';
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the validate trigger specified by the associated controller's
 * validateTrigger property occurs.
 */
var ValidateBindingBehavior = /** @class */ (function (_super) {
    __extends(ValidateBindingBehavior, _super);
    function ValidateBindingBehavior() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValidateBindingBehavior.prototype.getValidateTrigger = function (controller) {
        return controller.validateTrigger;
    };
    ValidateBindingBehavior.inject = [TaskQueue];
    return ValidateBindingBehavior;
}(ValidateBindingBehaviorBase));
export { ValidateBindingBehavior };
/**
 * Binding behavior. Indicates the bound property will be validated
 * manually, by calling controller.validate(). No automatic validation
 * triggered by data-entry or blur will occur.
 */
var ValidateManuallyBindingBehavior = /** @class */ (function (_super) {
    __extends(ValidateManuallyBindingBehavior, _super);
    function ValidateManuallyBindingBehavior() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValidateManuallyBindingBehavior.prototype.getValidateTrigger = function () {
        return validateTrigger.manual;
    };
    ValidateManuallyBindingBehavior.inject = [TaskQueue];
    return ValidateManuallyBindingBehavior;
}(ValidateBindingBehaviorBase));
export { ValidateManuallyBindingBehavior };
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs.
 */
var ValidateOnBlurBindingBehavior = /** @class */ (function (_super) {
    __extends(ValidateOnBlurBindingBehavior, _super);
    function ValidateOnBlurBindingBehavior() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValidateOnBlurBindingBehavior.prototype.getValidateTrigger = function () {
        return validateTrigger.blur;
    };
    ValidateOnBlurBindingBehavior.inject = [TaskQueue];
    return ValidateOnBlurBindingBehavior;
}(ValidateBindingBehaviorBase));
export { ValidateOnBlurBindingBehavior };
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element is changed by the user, causing a change
 * to the model.
 */
var ValidateOnChangeBindingBehavior = /** @class */ (function (_super) {
    __extends(ValidateOnChangeBindingBehavior, _super);
    function ValidateOnChangeBindingBehavior() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValidateOnChangeBindingBehavior.prototype.getValidateTrigger = function () {
        return validateTrigger.change;
    };
    ValidateOnChangeBindingBehavior.inject = [TaskQueue];
    return ValidateOnChangeBindingBehavior;
}(ValidateBindingBehaviorBase));
export { ValidateOnChangeBindingBehavior };
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs or is changed by the user, causing
 * a change to the model.
 */
var ValidateOnChangeOrBlurBindingBehavior = /** @class */ (function (_super) {
    __extends(ValidateOnChangeOrBlurBindingBehavior, _super);
    function ValidateOnChangeOrBlurBindingBehavior() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValidateOnChangeOrBlurBindingBehavior.prototype.getValidateTrigger = function () {
        return validateTrigger.changeOrBlur;
    };
    ValidateOnChangeOrBlurBindingBehavior.inject = [TaskQueue];
    return ValidateOnChangeOrBlurBindingBehavior;
}(ValidateBindingBehaviorBase));
export { ValidateOnChangeOrBlurBindingBehavior };
