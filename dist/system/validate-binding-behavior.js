System.register(["aurelia-task-queue", "./validate-trigger", "./validate-binding-behavior-base"], function (exports_1, context_1) {
    "use strict";
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
    var __moduleName = context_1 && context_1.id;
    var aurelia_task_queue_1, validate_trigger_1, validate_binding_behavior_base_1, ValidateBindingBehavior, ValidateManuallyBindingBehavior, ValidateOnBlurBindingBehavior, ValidateOnChangeBindingBehavior, ValidateOnChangeOrBlurBindingBehavior;
    return {
        setters: [
            function (aurelia_task_queue_1_1) {
                aurelia_task_queue_1 = aurelia_task_queue_1_1;
            },
            function (validate_trigger_1_1) {
                validate_trigger_1 = validate_trigger_1_1;
            },
            function (validate_binding_behavior_base_1_1) {
                validate_binding_behavior_base_1 = validate_binding_behavior_base_1_1;
            }
        ],
        execute: function () {
            ValidateBindingBehavior = /** @class */ (function (_super) {
                __extends(ValidateBindingBehavior, _super);
                /**
                 * Binding behavior. Indicates the bound property should be validated
                 * when the validate trigger specified by the associated controller's
                 * validateTrigger property occurs.
                 */
                function ValidateBindingBehavior() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ValidateBindingBehavior.prototype.getValidateTrigger = function (controller) {
                    return controller.validateTrigger;
                };
                ValidateBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
                return ValidateBindingBehavior;
            }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
            exports_1("ValidateBindingBehavior", ValidateBindingBehavior);
            ValidateManuallyBindingBehavior = /** @class */ (function (_super) {
                __extends(ValidateManuallyBindingBehavior, _super);
                /**
                 * Binding behavior. Indicates the bound property will be validated
                 * manually, by calling controller.validate(). No automatic validation
                 * triggered by data-entry or blur will occur.
                 */
                function ValidateManuallyBindingBehavior() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ValidateManuallyBindingBehavior.prototype.getValidateTrigger = function () {
                    return validate_trigger_1.validateTrigger.manual;
                };
                ValidateManuallyBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
                return ValidateManuallyBindingBehavior;
            }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
            exports_1("ValidateManuallyBindingBehavior", ValidateManuallyBindingBehavior);
            ValidateOnBlurBindingBehavior = /** @class */ (function (_super) {
                __extends(ValidateOnBlurBindingBehavior, _super);
                /**
                 * Binding behavior. Indicates the bound property should be validated
                 * when the associated element blurs.
                 */
                function ValidateOnBlurBindingBehavior() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ValidateOnBlurBindingBehavior.prototype.getValidateTrigger = function () {
                    return validate_trigger_1.validateTrigger.blur;
                };
                ValidateOnBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
                return ValidateOnBlurBindingBehavior;
            }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
            exports_1("ValidateOnBlurBindingBehavior", ValidateOnBlurBindingBehavior);
            ValidateOnChangeBindingBehavior = /** @class */ (function (_super) {
                __extends(ValidateOnChangeBindingBehavior, _super);
                /**
                 * Binding behavior. Indicates the bound property should be validated
                 * when the associated element is changed by the user, causing a change
                 * to the model.
                 */
                function ValidateOnChangeBindingBehavior() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ValidateOnChangeBindingBehavior.prototype.getValidateTrigger = function () {
                    return validate_trigger_1.validateTrigger.change;
                };
                ValidateOnChangeBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
                return ValidateOnChangeBindingBehavior;
            }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
            exports_1("ValidateOnChangeBindingBehavior", ValidateOnChangeBindingBehavior);
            ValidateOnChangeOrBlurBindingBehavior = /** @class */ (function (_super) {
                __extends(ValidateOnChangeOrBlurBindingBehavior, _super);
                /**
                 * Binding behavior. Indicates the bound property should be validated
                 * when the associated element blurs or is changed by the user, causing
                 * a change to the model.
                 */
                function ValidateOnChangeOrBlurBindingBehavior() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ValidateOnChangeOrBlurBindingBehavior.prototype.getValidateTrigger = function () {
                    return validate_trigger_1.validateTrigger.changeOrBlur;
                };
                ValidateOnChangeOrBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
                return ValidateOnChangeOrBlurBindingBehavior;
            }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
            exports_1("ValidateOnChangeOrBlurBindingBehavior", ValidateOnChangeOrBlurBindingBehavior);
        }
    };
});
