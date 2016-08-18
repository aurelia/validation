// Exports
define(["require", "exports", './validate-binding-behavior', './validate-trigger', './validation-controller', './validation-controller-factory', './validation-error', './validation-errors-custom-attribute', './validation-renderer-custom-attribute', './validator', './implementation/metadata-key', './implementation/standard-validator', './implementation/validation-messages', './implementation/validation-parser', './implementation/validation-rules', './validator', './implementation/standard-validator', './implementation/validation-parser', './implementation/validation-rules'], function (require, exports, validate_binding_behavior_1, validate_trigger_1, validation_controller_1, validation_controller_factory_1, validation_error_1, validation_errors_custom_attribute_1, validation_renderer_custom_attribute_1, validator_1, metadata_key_1, standard_validator_1, validation_messages_1, validation_parser_1, validation_rules_1, validator_2, standard_validator_2, validation_parser_2, validation_rules_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(validate_binding_behavior_1);
    __export(validate_trigger_1);
    __export(validation_controller_1);
    __export(validation_controller_factory_1);
    __export(validation_error_1);
    __export(validation_errors_custom_attribute_1);
    __export(validation_renderer_custom_attribute_1);
    __export(validator_1);
    __export(metadata_key_1);
    __export(standard_validator_1);
    __export(validation_messages_1);
    __export(validation_parser_1);
    __export(validation_rules_1);
    function configure(config) {
        // the fluent rule definition API needs the parser to translate messages
        // to interpolation expressions. 
        var parser = config.container.get(validation_parser_2.ValidationParser);
        validation_rules_2.ValidationRules.initialize(parser);
        // register the standard implementation of the Validator abstract class.
        var validator = config.container.get(standard_validator_2.StandardValidator);
        config.container.registerInstance(validator_2.Validator, validator);
        // globalize the behaviors.
        config.globalResources('./validate-binding-behavior', './validation-errors-custom-attribute', './validation-renderer-custom-attribute');
    }
    exports.configure = configure;
});
