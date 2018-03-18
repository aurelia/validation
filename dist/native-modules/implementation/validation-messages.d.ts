import { Expression } from 'aurelia-binding';
import { ValidationMessageParser } from './validation-message-parser';
export interface ValidationMessages {
    [key: string]: string;
}
/**
 * Dictionary of validation messages. [messageKey]: messageExpression
 */
export declare const validationMessages: ValidationMessages;
/**
 * Retrieves validation messages and property display names.
 */
export declare class ValidationMessageProvider {
    private parser;
    static inject: (typeof ValidationMessageParser)[];
    constructor(parser: ValidationMessageParser);
    /**
     * Returns a message binding expression that corresponds to the key.
     * @param key The message key.
     */
    getMessage(key: string): Expression;
    /**
     * Formulates a property display name using the property name and the configured
     * displayName (if provided).
     * Override this with your own custom logic.
     * @param propertyName The property name.
     */
    getDisplayName(propertyName: string, displayName?: string | null | (() => string)): string;
}
