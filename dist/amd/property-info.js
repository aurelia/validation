define(['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getPropertyInfo = getPropertyInfo;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function getObject(expression, objectExpression, source) {
    var value = objectExpression.evaluate(source);
    if (value !== null && ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || typeof value === 'function')) {
      return value;
    }
    if (value === null) {
      value = 'null';
    } else if (value === undefined) {
      value = 'undefined';
    }
    throw new Error('The \'' + objectExpression + '\' part of \'' + expression + '\' evaluates to ' + value + ' instead of an object.');
  }

  function getPropertyInfo(expression, source) {
    var originalExpression = expression;
    while (expression instanceof _aureliaBinding.BindingBehavior || expression instanceof _aureliaBinding.ValueConverter) {
      expression = expression.expression;
    }

    var object = void 0;
    var property = void 0;
    if (expression instanceof _aureliaBinding.AccessScope) {
      object = source.bindingContext;
      property = expression.name;
    } else if (expression instanceof _aureliaBinding.AccessMember) {
      object = getObject(originalExpression, expression.object, source);
      property = expression.name;
    } else if (expression instanceof _aureliaBinding.AccessKeyed) {
      object = getObject(originalExpression, expression.object, source);
      property = expression.key.evaluate(source);
    } else {
      throw new Error('Expression \'' + originalExpression + '\' is not compatible with the validate binding-behavior.');
    }

    return { object: object, property: property };
  }
});