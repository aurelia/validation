import { Expression, Scope } from 'aurelia-binding';
/**
 * Retrieves the object and property name for the specified expression.
 * @param expression The expression
 * @param source The scope
 */
export declare function getPropertyInfo(expression: Expression, source: Scope): {
    object: object;
    propertyName: string;
} | null;
