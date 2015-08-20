'use strict';

exports.__esModule = true;
exports.configure = configure;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _validationValidationConfig = require('./validation/validation-config');

var _validationValidation = require('./validation/validation');

var _validationUtilities = require('./validation/utilities');

exports.Utilities = _validationUtilities.Utilities;
exports.ValidationConfig = _validationValidationConfig.ValidationConfig;

var _validationValidationLocale = require('./validation/validation-locale');

exports.ValidationLocale = _validationValidationLocale.ValidationLocale;

var _validationValidationResult = require('./validation/validation-result');

_defaults(exports, _interopRequireWildcard(_validationValidationResult));

var _validationValidationRules = require('./validation/validation-rules');

_defaults(exports, _interopRequireWildcard(_validationValidationRules));

exports.Validation = _validationValidation.Validation;

var _validationValidateCustomAttribute = require('./validation/validate-custom-attribute');

exports.ValidateCustomAttribute = _validationValidateCustomAttribute.ValidateCustomAttribute;

var _validationValidateCustomAttributeViewStrategy = require('./validation/validate-custom-attribute-view-strategy');

exports.ValidateCustomAttributeViewStrategy = _validationValidateCustomAttributeViewStrategy.ValidateCustomAttributeViewStrategy;
exports.ValidateCustomAttributeViewStrategyBase = _validationValidateCustomAttributeViewStrategy.ValidateCustomAttributeViewStrategyBase;

var _validationDecorators = require('./validation/decorators');

exports.ensure = _validationDecorators.ensure;

function configure(aurelia, configCallback) {

  aurelia.globalResources('./validation/validate-custom-attribute');
  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(_validationValidation.Validation.defaults);
  }
  aurelia.singleton(_validationValidationConfig.ValidationConfig, _validationValidation.Validation.defaults);
  return _validationValidation.Validation.defaults.locale();
}