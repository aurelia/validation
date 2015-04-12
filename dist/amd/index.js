define(['exports', './validation/validation', './validation/utilities', './validation/validation-config', './validation/validation-locale', './validation/validation-result', './validation/validation-rules', './validation/validate-attached-behavior', './validation/validate-attached-behavior-config'], function (exports, _validationValidation, _validationUtilities, _validationValidationConfig, _validationValidationLocale, _validationValidationResult, _validationValidationRules, _validationValidateAttachedBehavior, _validationValidateAttachedBehaviorConfig) {
  'use strict';

  var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

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
  Object.defineProperty(exports, 'ValidateAttachedBehavior', {
    enumerable: true,
    get: function get() {
      return _validationValidateAttachedBehavior.ValidateAttachedBehavior;
    }
  });
  Object.defineProperty(exports, 'ValidateAttachedBehaviorConfig', {
    enumerable: true,
    get: function get() {
      return _validationValidateAttachedBehaviorConfig.ValidateAttachedBehaviorConfig;
    }
  });

  function install(aurelia, configCallback) {
    aurelia.globalizeResources('./validation/validate-attached-behavior');
    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(_validationValidation.Validation.defaults);
    }
    return _validationValidation.Validation.defaults.locale();
  }
});