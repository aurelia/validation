import { Expression, Scope } from 'aurelia-binding';
declare module 'aurelia-binding' {
    const getContextFor: any;
}
/**
 * Retrieves the object and property name for the specified expression.
 * @param expression The expression
 * @param source The scope
 */
export declare function getPropertyInfo(expression: Expression, source: Scope): {
    object: object;
    propertyName: string;
} | null;
