// Exports
define(["require", "exports", "./get-target-dom-element", "./property-info", "./property-accessor-parser", "./validate-binding-behavior", "./validate-event", "./validate-result", "./validate-trigger", "./validation-controller", "./validation-controller-factory", "./validation-errors-custom-attribute", "./validation-renderer-custom-attribute", "./validator", "./implementation/rules", "./implementation/standard-validator", "./implementation/validation-messages", "./implementation/validation-message-parser", "./implementation/validation-rules", "aurelia-pal", "./validator", "./implementation/standard-validator", "./implementation/validation-message-parser", "./property-accessor-parser", "./implementation/validation-rules"], function (require, exports, get_target_dom_element_1, property_info_1, property_accessor_parser_1, validate_binding_behavior_1, validate_event_1, validate_result_1, validate_trigger_1, validation_controller_1, validation_controller_factory_1, validation_errors_custom_attribute_1, validation_renderer_custom_attribute_1, validator_1, rules_1, standard_validator_1, validation_messages_1, validation_message_parser_1, validation_rules_1, aurelia_pal_1, validator_2, standard_validator_2, validation_message_parser_2, property_accessor_parser_2, validation_rules_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(get_target_dom_element_1);
    __export(property_info_1);
    __export(property_accessor_parser_1);
    __export(validate_binding_behavior_1);
    __export(validate_event_1);
    __export(validate_result_1);
    __export(validate_trigger_1);
    __export(validation_controller_1);
    __export(validation_controller_factory_1);
    __export(validation_errors_custom_attribute_1);
    __export(validation_renderer_custom_attribute_1);
    __export(validator_1);
    __export(rules_1);
    __export(standard_validator_1);
    __export(validation_messages_1);
    __export(validation_message_parser_1);
    __export(validation_rules_1);
    /**
     * Aurelia Validation Configuration API
     */
    var AureliaValidationConfiguration = /** @class */ (function () {
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
        var messageParser = frameworkConfig.container.get(validation_message_parser_2.ValidationMessageParser);
        var propertyParser = frameworkConfig.container.get(property_accessor_parser_2.PropertyAccessorParser);
        validation_rules_2.ValidationRules.initialize(messageParser, propertyParser);
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
});
