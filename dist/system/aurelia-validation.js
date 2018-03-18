// Exports
System.register(["./get-target-dom-element", "./property-info", "./property-accessor-parser", "./validate-binding-behavior", "./validate-event", "./validate-result", "./validate-trigger", "./validation-controller", "./validation-controller-factory", "./validation-errors-custom-attribute", "./validation-renderer-custom-attribute", "./validator", "./implementation/rules", "./implementation/standard-validator", "./implementation/validation-messages", "./implementation/validation-message-parser", "./implementation/validation-rules", "aurelia-pal"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
    exports_1("configure", configure);
    var aurelia_pal_1, validator_1, standard_validator_1, validation_message_parser_1, property_accessor_parser_1, validation_rules_1, AureliaValidationConfiguration;
    var exportedNames_1 = {
        "AureliaValidationConfiguration": true,
        "configure": true
    };
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters: [
            function (get_target_dom_element_1_1) {
                exportStar_1(get_target_dom_element_1_1);
            },
            function (property_info_1_1) {
                exportStar_1(property_info_1_1);
            },
            function (property_accessor_parser_2_1) {
                exportStar_1(property_accessor_parser_2_1);
                property_accessor_parser_1 = property_accessor_parser_2_1;
            },
            function (validate_binding_behavior_1_1) {
                exportStar_1(validate_binding_behavior_1_1);
            },
            function (validate_event_1_1) {
                exportStar_1(validate_event_1_1);
            },
            function (validate_result_1_1) {
                exportStar_1(validate_result_1_1);
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
            function (rules_1_1) {
                exportStar_1(rules_1_1);
            },
            function (standard_validator_2_1) {
                exportStar_1(standard_validator_2_1);
                standard_validator_1 = standard_validator_2_1;
            },
            function (validation_messages_1_1) {
                exportStar_1(validation_messages_1_1);
            },
            function (validation_message_parser_2_1) {
                exportStar_1(validation_message_parser_2_1);
                validation_message_parser_1 = validation_message_parser_2_1;
            },
            function (validation_rules_2_1) {
                exportStar_1(validation_rules_2_1);
                validation_rules_1 = validation_rules_2_1;
            },
            function (aurelia_pal_1_1) {
                aurelia_pal_1 = aurelia_pal_1_1;
            }
        ],
        execute: function () {// Exports
            /**
             * Aurelia Validation Configuration API
             */
            AureliaValidationConfiguration = /** @class */ (function () {
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
            exports_1("AureliaValidationConfiguration", AureliaValidationConfiguration);
        }
    };
});
