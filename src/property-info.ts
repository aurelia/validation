import {
  AccessMember,
  AccessScope,
  AccessKeyed,
  BindingBehavior,
  Expression,
  ValueConverter
} from 'aurelia-binding';

function getObject(expression: Expression, objectExpression: Expression, source: any): null | undefined | Object {
  const value = objectExpression.evaluate(source, null as any);
  if (value === null || value === undefined || value instanceof Object) {
    return value;
  }
  // tslint:disable-next-line:max-line-length
  throw new Error(`The '${objectExpression}' part of '${expression}' evaluates to ${value} instead of an object, null or undefined.`);
}

/**
 * Retrieves the object and property name for the specified expression.
 * @param expression The expression
 * @param source The scope
 */
export function getPropertyInfo(expression: Expression, source: any): { object: Object; propertyName: string; } | null {
  const originalExpression = expression;
  while (expression instanceof BindingBehavior || expression instanceof ValueConverter) {
    expression = expression.expression;
  }

  let object: null | undefined | Object;
  let propertyName: string;
  if (expression instanceof AccessScope) {
    object = source.bindingContext;
    propertyName = expression.name;
  } else if (expression instanceof AccessMember) {
    object = getObject(originalExpression, expression.object, source);
    propertyName = expression.name;
  } else if (expression instanceof AccessKeyed) {
    object = getObject(originalExpression, expression.object, source);
    propertyName = expression.key.evaluate(source);
  } else {
    throw new Error(`Expression '${originalExpression}' is not compatible with the validate binding-behavior.`);
  }
  if (object === null || object === undefined) {
    return null;
  }
  return { object, propertyName };
}
