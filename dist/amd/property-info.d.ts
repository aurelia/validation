import { Expression } from 'aurelia-binding';
/**
 * Retrieves the object and property name for the specified expression.
 * @param expression The expression
 * @param source The scope
 */
export declare function getPropertyInfo(expression: Expression, source: any): {
    object: any;
    propertyName: string;
};
