import { AccessMember, AccessScope, AccessKeyed, BindingBehavior, ValueConverter } from 'aurelia-binding';
function getObject(expression, objectExpression, source) {
    let value = objectExpression.evaluate(source, null);
    if (value === null || value === undefined || value instanceof Object) {
        return value;
    }
    /* tslint:disable */
    throw new Error(`The '${objectExpression}' part of '${expression}' evaluates to ${value} instead of an object, null or undefined.`);
    /* tslint:enable */
}
/**
 * Retrieves the object and property name for the specified expression.
 * @param expression The expression
 * @param source The scope
 */
export function getPropertyInfo(expression, source) {
    const originalExpression = expression;
    while (expression instanceof BindingBehavior || expression instanceof ValueConverter) {
        expression = expression.expression;
    }
    let object;
    let propertyName;
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
        throw new Error(`Expression '${originalExpression}' is not compatible with the validate binding-behavior.`);
    }
    if (object === null || object === undefined) {
        return null;
    }
    return { object, propertyName };
}
