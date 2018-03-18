"use strict";
// Exports
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./get-target-dom-element"));
__export(require("./property-info"));
__export(require("./property-accessor-parser"));
__export(require("./validate-binding-behavior"));
__export(require("./validate-event"));
__export(require("./validate-result"));
__export(require("./validate-trigger"));
__export(require("./validation-controller"));
__export(require("./validation-controller-factory"));
__export(require("./validation-errors-custom-attribute"));
__export(require("./validation-renderer-custom-attribute"));
__export(require("./validator"));
__export(require("./implementation/rules"));
__export(require("./implementation/standard-validator"));
__export(require("./implementation/validation-messages"));
__export(require("./implementation/validation-message-parser"));
__export(require("./implementation/validation-rules"));
// Configuration
var aurelia_pal_1 = require("aurelia-pal");
var validator_1 = require("./validator");
var standard_validator_1 = require("./implementation/standard-validator");
var validation_message_parser_1 = require("./implementation/validation-message-parser");
var property_accessor_parser_1 = require("./property-accessor-parser");
var validation_rules_1 = require("./implementation/validation-rules");
/**
 * Aurelia Validation Configuration API
 */
var AureliaValidationConfiguration = /** @class */ (function () {
    function AureliaValidationConfiguration() {
        this.validatorType = standard_validator_1.StandardValidator;
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
        container.registerInstance(validator_1.Validator, validator);
    };
    return AureliaValidationConfiguration;
}());
exports.AureliaValidationConfiguration = AureliaValidationConfiguration;
/**
 * Configures the plugin.
 */
function configure(frameworkConfig, callback) {
    // the fluent rule definition API needs the parser to translate messages
    // to interpolation expressions.
    var messageParser = frameworkConfig.container.get(validation_message_parser_1.ValidationMessageParser);
    var propertyParser = frameworkConfig.container.get(property_accessor_parser_1.PropertyAccessorParser);
    validation_rules_1.ValidationRules.initialize(messageParser, propertyParser);
    // configure...
    var config = new AureliaValidationConfiguration();
    if (callback instanceof Function) {
        callback(config);
    }
    config.apply(frameworkConfig.container);
    // globalize the behaviors.
    if (frameworkConfig.globalResources) {
        frameworkConfig.globalResources(aurelia_pal_1.PLATFORM.moduleName('./validate-binding-behavior'), aurelia_pal_1.PLATFORM.moduleName('./validation-errors-custom-attribute'), aurelia_pal_1.PLATFORM.moduleName('./validation-renderer-custom-attribute'));
    }
}
exports.configure = configure;
