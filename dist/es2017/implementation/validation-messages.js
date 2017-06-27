import { ValidationMessageParser } from './validation-message-parser';
/**
 * Dictionary of validation messages. [messageKey]: messageExpression
 */
export const validationMessages = {
    /**
     * The default validation message. Used with rules that have no standard message.
     */
    default: `\${$displayName} is invalid.`,
    required: `\${$displayName} is required.`,
    matches: `\${$displayName} is not correctly formatted.`,
    email: `\${$displayName} is not a valid email.`,
    minLength: `\${$displayName} must be at least \${$config.length} character\${$config.length === 1 ? '' : 's'}.`,
    maxLength: `\${$displayName} cannot be longer than \${$config.length} character\${$config.length === 1 ? '' : 's'}.`,
    minItems: `\${$displayName} must contain at least \${$config.count} item\${$config.count === 1 ? '' : 's'}.`,
    maxItems: `\${$displayName} cannot contain more than \${$config.count} item\${$config.count === 1 ? '' : 's'}.`,
    equals: `\${$displayName} must be \${$config.expectedValue}.`,
};
/**
 * Retrieves validation messages and property display names.
 */
export class ValidationMessageProvider {
    constructor(parser) {
        this.parser = parser;
    }
    /**
     * Returns a message binding expression that corresponds to the key.
     * @param key The message key.
     */
    getMessage(key) {
        let message;
        if (key in validationMessages) {
            message = validationMessages[key];
        }
        else {
            message = validationMessages['default'];
        }
        return this.parser.parse(message);
    }
    /**
     * Formulates a property display name using the property name and the configured
     * displayName (if provided).
     * Override this with your own custom logic.
     * @param propertyName The property name.
     */
    getDisplayName(propertyName, displayName) {
        if (displayName !== null && displayName !== undefined) {
            return (displayName instanceof Function) ? displayName() : displayName;
        }
        // split on upper-case letters.
        const words = propertyName.split(/(?=[A-Z])/).join(' ');
        // capitalize first letter.
        return words.charAt(0).toUpperCase() + words.slice(1);
    }
}
ValidationMessageProvider.inject = [ValidationMessageParser];
