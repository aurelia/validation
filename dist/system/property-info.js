'use strict';

System.register(['aurelia-binding'], function (_export, _context) {
  "use strict";

  var AccessMember, AccessScope, AccessKeyed, BindingBehavior, ValueConverter, _typeof;

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

  return {
    setters: [function (_aureliaBinding) {
      AccessMember = _aureliaBinding.AccessMember;
      AccessScope = _aureliaBinding.AccessScope;
      AccessKeyed = _aureliaBinding.AccessKeyed;
      BindingBehavior = _aureliaBinding.BindingBehavior;
      ValueConverter = _aureliaBinding.ValueConverter;
    }],
    execute: function () {
      _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
      };
      function getPropertyInfo(expression, source) {
        var originalExpression = expression;
        while (expression instanceof BindingBehavior || expression instanceof ValueConverter) {
          expression = expression.expression;
        }

        var object = void 0;
        var property = void 0;
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
          throw new Error('Expression \'' + originalExpression + '\' is not compatible with the validate binding-behavior.');
        }

        return { object: object, property: property };
      }

      _export('getPropertyInfo', getPropertyInfo);
    }
  };
});