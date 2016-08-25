"use strict";
var validation_parser_1 = require('./validation-parser');
/**
 * Dictionary of validation messages. [messageKey]: messageExpression
 */
exports.validationMessages = {
    /**
     * The default validation message. Used with rules that have no standard message.
     */
    default: "${$displayName} is invalid.",
    required: "${$displayName} is required.",
    matches: "${$displayName} is not correctly formatted.",
    email: "${$displayName} is not a valid email.",
    minLength: "${$displayName} must be at least ${$config.length} character${$config.length === 1 ? '' : 's'}.",
    maxLength: "${$displayName} cannot be longer than ${$config.length} character${$config.length === 1 ? '' : 's'}.",
    minItems: "${$displayName} must contain at least ${$config.count} item${$config.count === 1 ? '' : 's'}.",
    maxItems: "${$displayName} cannot contain more than ${$config.count} item${$config.count === 1 ? '' : 's'}.",
};
/**
 * Retrieves validation messages and property display names.
 */
var ValidationMessageProvider = (function () {
    function ValidationMessageProvider(parser) {
        this.parser = parser;
    }
    /**
     * Returns a message binding expression that corresponds to the key.
     * @param key The message key.
     */
    ValidationMessageProvider.prototype.getMessage = function (key) {
        var message;
        if (key in exports.validationMessages) {
            message = exports.validationMessages[key];
        }
        else {
            message = exports.validationMessages['default'];
        }
        return this.parser.parseMessage(message);
    };
    /**
     * When a display name is not provided, this method is used to formulate
     * a display name using the property name.
     * Override this with your own custom logic.
     * @param propertyName The property name.
     */
    ValidationMessageProvider.prototype.computeDisplayName = function (propertyName) {
        // split on upper-case letters.
        var words = propertyName.split(/(?=[A-Z])/).join(' ');
        // capitalize first letter.
        return words.charAt(0).toUpperCase() + words.slice(1);
    };
    ValidationMessageProvider.inject = [validation_parser_1.ValidationParser];
    return ValidationMessageProvider;
}());
exports.ValidationMessageProvider = ValidationMessageProvider;
