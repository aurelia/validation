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
function configure(frameworkConfig, config) {
    // the fluent rule definition API needs the parser to translate messages
    // to interpolation expressions. 
    var parser = frameworkConfig.container.get(validation_parser_2.ValidationParser);
    validation_rules_2.ValidationRules.initialize(parser);
    if (!config.customValidator) {
        // register the standard implementation of the Validator abstract class.
        var validator = frameworkConfig.container.get(standard_validator_2.StandardValidator);
        frameworkConfig.container.registerInstance(validator_2.Validator, validator);
    }
    // globalize the behaviors.
    frameworkConfig.globalResources('./validate-binding-behavior', './validation-errors-custom-attribute', './validation-renderer-custom-attribute');
}
exports.configure = configure;
