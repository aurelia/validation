// Exports
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./validate-binding-behavior'));
__export(require('./validate-trigger'));
__export(require('./validation-controller'));
__export(require('./validation-controller-factory'));
__export(require('./validation-error'));
__export(require('./validation-errors-custom-attribute'));
__export(require('./validation-renderer-custom-attribute'));
__export(require('./validator'));
__export(require('./implementation/metadata-key'));
__export(require('./implementation/standard-validator'));
__export(require('./implementation/validation-messages'));
__export(require('./implementation/validation-parser'));
__export(require('./implementation/validation-rules'));
var validator_2 = require('./validator');
var standard_validator_2 = require('./implementation/standard-validator');
var validation_parser_2 = require('./implementation/validation-parser');
var validation_rules_2 = require('./implementation/validation-rules');
/**
 * Aurelia Validation Configuration API
 */
var AureliaValidationConfiguration = (function () {
    function AureliaValidationConfiguration() {
        this.validatorType = standard_validator_2.StandardValidator;
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
        container.registerInstance(validator_2.Validator, validator);
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
    var parser = frameworkConfig.container.get(validation_parser_2.ValidationParser);
    validation_rules_2.ValidationRules.initialize(parser);
    // configure...
    var config = new AureliaValidationConfiguration();
    if (callback instanceof Function) {
        callback(config);
    }
    config.apply(frameworkConfig.container);
    // globalize the behaviors.
    frameworkConfig.globalResources('./validate-binding-behavior', './validation-errors-custom-attribute', './validation-renderer-custom-attribute');
}
exports.configure = configure;
