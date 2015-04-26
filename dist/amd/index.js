define(['exports', './validation/validation-config', './validation/validation', './validation/utilities', './validation/validation-locale', './validation/validation-result', './validation/validation-rules', './validation/validate-custom-attribute', './validation/validate-custom-attribute-view-strategy'], function (exports, _validationValidationConfig, _validationValidation, _validationUtilities, _validationValidationLocale, _validationValidationResult, _validationValidationRules, _validationValidateCustomAttribute, _validationValidateCustomAttributeViewStrategy) {
  'use strict';

  var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === 'object' && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } };

  var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.install = install;
  Object.defineProperty(exports, 'Utilities', {
    enumerable: true,
    get: function get() {
      return _validationUtilities.Utilities;
    }
  });
  Object.defineProperty(exports, 'ValidationConfig', {
    enumerable: true,
    get: function get() {
      return _validationValidationConfig.ValidationConfig;
    }
  });
  Object.defineProperty(exports, 'ValidationLocale', {
    enumerable: true,
    get: function get() {
      return _validationValidationLocale.ValidationLocale;
    }
  });

  _defaults(exports, _interopRequireWildcard(_validationValidationResult));

  _defaults(exports, _interopRequireWildcard(_validationValidationRules));

  Object.defineProperty(exports, 'Validation', {
    enumerable: true,
    get: function get() {
      return _validationValidation.Validation;
    }
  });
  Object.defineProperty(exports, 'ValidateCustomAttribute', {
    enumerable: true,
    get: function get() {
      return _validationValidateCustomAttribute.ValidateCustomAttribute;
    }
  });
  Object.defineProperty(exports, 'ValidateCustomAttributeViewStrategy', {
    enumerable: true,
    get: function get() {
      return _validationValidateCustomAttributeViewStrategy.ValidateCustomAttributeViewStrategy;
    }
  });

  function install(aurelia, configCallback) {

    aurelia.globalizeResources('./validation/validate-custom-attribute');
    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(_validationValidation.Validation.defaults);
    }
    aurelia.container.registerInstance(_validationValidationConfig.ValidationConfig, _validationValidation.Validation.defaults);
    return _validationValidation.Validation.defaults.locale();
  }
});