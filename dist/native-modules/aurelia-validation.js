// Exports
export * from './get-target-dom-element';
export * from './property-info';
export * from './property-accessor-parser';
export * from './validate-binding-behavior';
export * from './validate-event';
export * from './validate-result';
export * from './validate-trigger';
export * from './validation-controller';
export * from './validation-controller-factory';
export * from './validation-errors-custom-attribute';
export * from './validation-renderer-custom-attribute';
export * from './validator';
export * from './implementation/rules';
export * from './implementation/standard-validator';
export * from './implementation/validation-messages';
export * from './implementation/validation-message-parser';
export * from './implementation/validation-rules';
// Configuration
import { PLATFORM } from 'aurelia-pal';
import { Validator } from './validator';
import { StandardValidator } from './implementation/standard-validator';
import { ValidationMessageParser } from './implementation/validation-message-parser';
import { PropertyAccessorParser } from './property-accessor-parser';
import { ValidationRules } from './implementation/validation-rules';
/**
 * Aurelia Validation Configuration API
 */
var AureliaValidationConfiguration = /** @class */ (function () {
    function AureliaValidationConfiguration() {
        this.validatorType = StandardValidator;
    }
    /**
     * Use a custom Validator implementation.
     */
    AureliaValidationConfiguration.prototype.customValidator = function (type) {
        this.validatorType = type;
    };
    /**
     * Applies the configuration.
     */
    AureliaValidationConfiguration.prototype.apply = function (container) {
        var validator = container.get(this.validatorType);
        container.registerInstance(Validator, validator);
    };
    return AureliaValidationConfiguration;
}());
export { AureliaValidationConfiguration };
/**
 * Configures the plugin.
 */
export function configure(frameworkConfig, callback) {
    // the fluent rule definition API needs the parser to translate messages
    // to interpolation expressions.
    var messageParser = frameworkConfig.container.get(ValidationMessageParser);
    var propertyParser = frameworkConfig.container.get(PropertyAccessorParser);
    ValidationRules.initialize(messageParser, propertyParser);
    // configure...
    var config = new AureliaValidationConfiguration();
    if (callback instanceof Function) {
        callback(config);
    }
    config.apply(frameworkConfig.container);
    // globalize the behaviors.
    if (frameworkConfig.globalResources) {
        frameworkConfig.globalResources(PLATFORM.moduleName('./validate-binding-behavior'), PLATFORM.moduleName('./validation-errors-custom-attribute'), PLATFORM.moduleName('./validation-renderer-custom-attribute'));
    }
}
