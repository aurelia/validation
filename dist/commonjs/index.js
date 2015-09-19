'use strict';

exports.__esModule = true;
exports.configure = configure;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

var _validationConfig = require('./validation-config');

var _validation = require('./validation');

var _utilities = require('./utilities');

exports.Utilities = _utilities.Utilities;
exports.ValidationConfig = _validationConfig.ValidationConfig;

var _validationLocale = require('./validation-locale');

exports.ValidationLocale = _validationLocale.ValidationLocale;

var _validationResult = require('./validation-result');

_defaults(exports, _interopRequireWildcard(_validationResult));

var _validationRules = require('./validation-rules');

_defaults(exports, _interopRequireWildcard(_validationRules));

exports.Validation = _validation.Validation;

var _validationGroup = require('./validation-group');

exports.ValidationGroup = _validationGroup.ValidationGroup;

var _validateCustomAttribute = require('./validate-custom-attribute');

exports.ValidateCustomAttribute = _validateCustomAttribute.ValidateCustomAttribute;

var _validationViewStrategy = require('./validation-view-strategy');

exports.ValidationViewStrategy = _validationViewStrategy.ValidationViewStrategy;

var _strategiesTwbootstrapViewStrategy = require('./strategies/twbootstrap-view-strategy');

exports.TWBootstrapViewStrategy = _strategiesTwbootstrapViewStrategy.TWBootstrapViewStrategy;

var _decorators = require('./decorators');

exports.ensure = _decorators.ensure;

function configure(aurelia, configCallback) {
  aurelia.globalResources('./validate-custom-attribute');
  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(_validation.Validation.defaults);
  }
  aurelia.singleton(_validationConfig.ValidationConfig, _validation.Validation.defaults);
  return _validation.Validation.defaults.locale();
}