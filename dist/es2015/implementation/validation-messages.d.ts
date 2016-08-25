import { Expression } from 'aurelia-binding';
import { ValidationParser } from './validation-parser';
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
    static inject: typeof ValidationParser[];
    constructor(parser: ValidationParser);
    /**
     * Returns a message binding expression that corresponds to the key.
     * @param key The message key.
     */
    getMessage(key: string): Expression;
    /**
     * When a display name is not provided, this method is used to formulate
     * a display name using the property name.
     * Override this with your own custom logic.
     * @param propertyName The property name.
     */
    computeDisplayName(propertyName: string): string;
}
