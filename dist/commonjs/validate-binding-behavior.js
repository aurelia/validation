"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aurelia_task_queue_1 = require('aurelia-task-queue');
var validate_trigger_1 = require('./validate-trigger');
var validate_binding_behavior_base_1 = require('./validate-binding-behavior-base');
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the validate trigger specified by the associated controller's
 * validateTrigger property occurs.
 */
var ValidateBindingBehavior = (function (_super) {
    __extends(ValidateBindingBehavior, _super);
    function ValidateBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateBindingBehavior.prototype.getValidateTrigger = function (controller) {
        return controller.validateTrigger;
    };
    ValidateBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    return ValidateBindingBehavior;
}(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
exports.ValidateBindingBehavior = ValidateBindingBehavior;
/**
 * Binding behavior. Indicates the bound property will be validated
 * manually, by calling controller.validate(). No automatic validation
 * triggered by data-entry or blur will occur.
 */
var ValidateManuallyBindingBehavior = (function (_super) {
    __extends(ValidateManuallyBindingBehavior, _super);
    function ValidateManuallyBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateManuallyBindingBehavior.prototype.getValidateTrigger = function () {
        return validate_trigger_1.validateTrigger.manual;
    };
    ValidateManuallyBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    return ValidateManuallyBindingBehavior;
}(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
exports.ValidateManuallyBindingBehavior = ValidateManuallyBindingBehavior;
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs.
 */
var ValidateOnBlurBindingBehavior = (function (_super) {
    __extends(ValidateOnBlurBindingBehavior, _super);
    function ValidateOnBlurBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateOnBlurBindingBehavior.prototype.getValidateTrigger = function () {
        return validate_trigger_1.validateTrigger.blur;
    };
    ValidateOnBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    return ValidateOnBlurBindingBehavior;
}(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
exports.ValidateOnBlurBindingBehavior = ValidateOnBlurBindingBehavior;
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element is changed by the user, causing a change
 * to the model.
 */
var ValidateOnChangeBindingBehavior = (function (_super) {
    __extends(ValidateOnChangeBindingBehavior, _super);
    function ValidateOnChangeBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateOnChangeBindingBehavior.prototype.getValidateTrigger = function () {
        return validate_trigger_1.validateTrigger.change;
    };
    ValidateOnChangeBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    return ValidateOnChangeBindingBehavior;
}(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
exports.ValidateOnChangeBindingBehavior = ValidateOnChangeBindingBehavior;
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs or is changed by the user, causing
 * a change to the model.
 */
var ValidateOnChangeOrBlurBindingBehavior = (function (_super) {
    __extends(ValidateOnChangeOrBlurBindingBehavior, _super);
    function ValidateOnChangeOrBlurBindingBehavior() {
        _super.apply(this, arguments);
    }
    ValidateOnChangeOrBlurBindingBehavior.prototype.getValidateTrigger = function () {
        return validate_trigger_1.validateTrigger.changeOrBlur;
    };
    ValidateOnChangeOrBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
    return ValidateOnChangeOrBlurBindingBehavior;
}(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
exports.ValidateOnChangeOrBlurBindingBehavior = ValidateOnChangeOrBlurBindingBehavior;
