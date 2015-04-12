'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.install = install;

var _Validation = require('./validation/validation');

var _Utilities = require('./validation/utilities');

Object.defineProperty(exports, 'Utilities', {
  enumerable: true,
  get: function get() {
    return _Utilities.Utilities;
  }
});

var _ValidationConfig = require('./validation/validation-config');

Object.defineProperty(exports, 'ValidationConfig', {
  enumerable: true,
  get: function get() {
    return _ValidationConfig.ValidationConfig;
  }
});

var _ValidationLocale = require('./validation/validation-locale');

Object.defineProperty(exports, 'ValidationLocale', {
  enumerable: true,
  get: function get() {
    return _ValidationLocale.ValidationLocale;
  }
});

var _validationValidationResult = require('./validation/validation-result');

_defaults(exports, _interopRequireWildcard(_validationValidationResult));

var _validationValidationRules = require('./validation/validation-rules');

_defaults(exports, _interopRequireWildcard(_validationValidationRules));

Object.defineProperty(exports, 'Validation', {
  enumerable: true,
  get: function get() {
    return _Validation.Validation;
  }
});

var _ValidateAttachedBehavior = require('./validation/validate-attached-behavior');

Object.defineProperty(exports, 'ValidateAttachedBehavior', {
  enumerable: true,
  get: function get() {
    return _ValidateAttachedBehavior.ValidateAttachedBehavior;
  }
});

var _ValidateAttachedBehaviorConfig = require('./validation/validate-attached-behavior-config');

Object.defineProperty(exports, 'ValidateAttachedBehaviorConfig', {
  enumerable: true,
  get: function get() {
    return _ValidateAttachedBehaviorConfig.ValidateAttachedBehaviorConfig;
  }
});

function install(aurelia, configCallback) {
  aurelia.globalizeResources('./validation/validate-attached-behavior');
  if (configCallback !== undefined && typeof (configCallback === 'function')) {
    configCallback(_Validation.Validation.defaults);
  }
  return _Validation.Validation.defaults.locale();
}