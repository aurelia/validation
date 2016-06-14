import { AccessMember, AccessScope, AccessKeyed, BindingBehavior, ValueConverter } from 'aurelia-binding';

function getObject(expression, objectExpression, source) {
  let value = objectExpression.evaluate(source);
  if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
    return value;
  }
  if (value === null) {
    value = 'null';
  } else if (value === undefined) {
    value = 'undefined';
  }
  throw new Error(`The '${ objectExpression }' part of '${ expression }' evaluates to ${ value } instead of an object.`);
}

export function getPropertyInfo(expression, source) {
  const originalExpression = expression;
  while (expression instanceof BindingBehavior || expression instanceof ValueConverter) {
    expression = expression.expression;
  }

  let object;
  let property;
  if (expression instanceof AccessScope) {
    object = source.bindingContext;
    property = expression.name;
  } else if (expression instanceof AccessMember) {
    object = getObject(originalExpression, expression.object, source);
    property = expression.name;
  } else if (expression instanceof AccessKeyed) {
    object = getObject(originalExpression, expression.object, source);
    property = expression.key.evaluate(source);
  } else {
    throw new Error(`Expression '${ originalExpression }' is not compatible with the validate binding-behavior.`);
  }

  return { object, property };
}