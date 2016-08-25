import { AccessMember, AccessScope, AccessKeyed, BindingBehavior, ValueConverter } from 'aurelia-binding';
function getObject(expression, objectExpression, source) {
    var value = objectExpression.evaluate(source, null);
    if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
        return value;
    }
    if (value === null) {
        value = 'null';
    }
    else if (value === undefined) {
        value = 'undefined';
    }
    throw new Error("The '" + objectExpression + "' part of '" + expression + "' evaluates to " + value + " instead of an object.");
}
/**
 * Retrieves the object and property name for the specified expression.
 * @param expression The expression
 * @param source The scope
 */
export function getPropertyInfo(expression, source) {
    var originalExpression = expression;
    while (expression instanceof BindingBehavior || expression instanceof ValueConverter) {
        expression = expression.expression;
    }
    var object;
    var propertyName;
    if (expression instanceof AccessScope) {
        object = source.bindingContext;
        propertyName = expression.name;
    }
    else if (expression instanceof AccessMember) {
        object = getObject(originalExpression, expression.object, source);
        propertyName = expression.name;
    }
    else if (expression instanceof AccessKeyed) {
        object = getObject(originalExpression, expression.object, source);
        propertyName = expression.key.evaluate(source);
    }
    else {
        throw new Error("Expression '" + originalExpression + "' is not compatible with the validate binding-behavior.");
    }
    return { object: object, propertyName: propertyName };
}
