'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

exports.__esModule = true;
exports.configure = configure;

var _ValidationConfig = require('./validation/validation-config');

var _Validation = require('./validation/validation');

var _Utilities = require('./validation/utilities');

exports.Utilities = _Utilities.Utilities;
exports.ValidationConfig = _ValidationConfig.ValidationConfig;

var _ValidationLocale = require('./validation/validation-locale');

exports.ValidationLocale = _ValidationLocale.ValidationLocale;

var _validationValidationResult = require('./validation/validation-result');

_defaults(exports, _interopRequireWildcard(_validationValidationResult));

var _validationValidationRules = require('./validation/validation-rules');

_defaults(exports, _interopRequireWildcard(_validationValidationRules));

exports.Validation = _Validation.Validation;

var _ValidateCustomAttribute = require('./validation/validate-custom-attribute');

exports.ValidateCustomAttribute = _ValidateCustomAttribute.ValidateCustomAttribute;

var _ValidateCustomAttributeViewStrategy = require('./validation/validate-custom-attribute-view-strategy');

exports.ValidateCustomAttributeViewStrategy = _ValidateCustomAttributeViewStrategy.ValidateCustomAttributeViewStrategy;

var _ensure = require('./validation/decorators');

exports.ensure = _ensure.ensure;

function configure(aurelia, configCallback) {

  aurelia.globalizeResources('./validation/validate-custom-attribute');
  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(_Validation.Validation.defaults);
  }
  aurelia.withSingleton(_ValidationConfig.ValidationConfig, _Validation.Validation.defaults);
  return _Validation.Validation.defaults.locale();
}