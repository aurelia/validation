"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_binding_1 = require("aurelia-binding");
function getObject(expression, objectExpression, source) {
    var value = objectExpression.evaluate(source, null);
    if (value === null || value === undefined || value instanceof Object) {
        return value;
    }
    // tslint:disable-next-line:max-line-length
    throw new Error("The '" + objectExpression + "' part of '" + expression + "' evaluates to " + value + " instead of an object, null or undefined.");
}
/**
 * Retrieves the object and property name for the specified expression.
 * @param expression The expression
 * @param source The scope
 */
function getPropertyInfo(expression, source) {
    var originalExpression = expression;
    while (expression instanceof aurelia_binding_1.BindingBehavior || expression instanceof aurelia_binding_1.ValueConverter) {
        expression = expression.expression;
    }
    var object;
    var propertyName;
    if (expression instanceof aurelia_binding_1.AccessScope) {
        object = aurelia_binding_1.getContextFor(expression.name, source, expression.ancestor);
        propertyName = expression.name;
    }
    else if (expression instanceof aurelia_binding_1.AccessMember) {
        object = getObject(originalExpression, expression.object, source);
        propertyName = expression.name;
    }
    else if (expression instanceof aurelia_binding_1.AccessKeyed) {
        object = getObject(originalExpression, expression.object, source);
        propertyName = expression.key.evaluate(source);
    }
    else {
        throw new Error("Expression '" + originalExpression + "' is not compatible with the validate binding-behavior.");
    }
    if (object === null || object === undefined) {
        return null;
    }
    return { object: object, propertyName: propertyName };
}
exports.getPropertyInfo = getPropertyInfo;
