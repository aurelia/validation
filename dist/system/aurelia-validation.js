// Exports
System.register(['./validate-binding-behavior', './validate-trigger', './validation-controller', './validation-controller-factory', './validation-error', './validation-errors-custom-attribute', './validation-renderer-custom-attribute', './validator', './implementation/metadata-key', './implementation/standard-validator', './implementation/validation-messages', './implementation/validation-parser', './implementation/validation-rules'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var validator_1, standard_validator_1, validation_parser_1, validation_rules_1;
    function configure(frameworkConfig, config) {
        // the fluent rule definition API needs the parser to translate messages
        // to interpolation expressions. 
        var parser = frameworkConfig.container.get(validation_parser_1.ValidationParser);
        validation_rules_1.ValidationRules.initialize(parser);
        if (!config.customValidator) {
            // register the standard implementation of the Validator abstract class.
            var validator = frameworkConfig.container.get(standard_validator_1.StandardValidator);
            frameworkConfig.container.registerInstance(validator_1.Validator, validator);
        }
        // globalize the behaviors.
        frameworkConfig.globalResources('./validate-binding-behavior', './validation-errors-custom-attribute', './validation-renderer-custom-attribute');
    }
    exports_1("configure", configure);
    var exportedNames_1 = {
        'configure': true
    };
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default"&& !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters:[
            function (validate_binding_behavior_1_1) {
                exportStar_1(validate_binding_behavior_1_1);
            },
            function (validate_trigger_1_1) {
                exportStar_1(validate_trigger_1_1);
            },
            function (validation_controller_1_1) {
                exportStar_1(validation_controller_1_1);
            },
            function (validation_controller_factory_1_1) {
                exportStar_1(validation_controller_factory_1_1);
            },
            function (validation_error_1_1) {
                exportStar_1(validation_error_1_1);
            },
            function (validation_errors_custom_attribute_1_1) {
                exportStar_1(validation_errors_custom_attribute_1_1);
            },
            function (validation_renderer_custom_attribute_1_1) {
                exportStar_1(validation_renderer_custom_attribute_1_1);
            },
            function (validator_2_1) {
                exportStar_1(validator_2_1);
                validator_1 = validator_2_1;
            },
            function (metadata_key_1_1) {
                exportStar_1(metadata_key_1_1);
            },
            function (standard_validator_2_1) {
                exportStar_1(standard_validator_2_1);
                standard_validator_1 = standard_validator_2_1;
            },
            function (validation_messages_1_1) {
                exportStar_1(validation_messages_1_1);
            },
            function (validation_parser_2_1) {
                exportStar_1(validation_parser_2_1);
                validation_parser_1 = validation_parser_2_1;
            },
            function (validation_rules_2_1) {
                exportStar_1(validation_rules_2_1);
                validation_rules_1 = validation_rules_2_1;
            }],
        execute: function() {
        }
    }
});
