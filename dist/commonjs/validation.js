'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.install = install;

var _validationValidationLocaleRepository = require('./validation/validation-locale-repository');

_defaults(exports, _interopRequireWildcard(_validationValidationLocaleRepository));

var _validationValidationResult = require('./validation/validation-result');

_defaults(exports, _interopRequireWildcard(_validationValidationResult));

var _validationValidationRules = require('./validation/validation-rules');

_defaults(exports, _interopRequireWildcard(_validationValidationRules));

var _validationValidationRulesCollection = require('./validation/validation-rules-collection');

_defaults(exports, _interopRequireWildcard(_validationValidationRulesCollection));

var _validationValidationGroupBuilder = require('./validation/validation-group-builder');

_defaults(exports, _interopRequireWildcard(_validationValidationGroupBuilder));

var _validationValidation = require('./validation/validation');

_defaults(exports, _interopRequireWildcard(_validationValidation));

var _validationValidateAttachedBehavior = require('./validation/validate-attached-behavior');

_defaults(exports, _interopRequireWildcard(_validationValidateAttachedBehavior));

var _validationValidateAttachedBehaviorConfig = require('./validation/validate-attached-behavior-config');

_defaults(exports, _interopRequireWildcard(_validationValidateAttachedBehaviorConfig));

var _validationDebouncer = require('./validation/debouncer');

_defaults(exports, _interopRequireWildcard(_validationDebouncer));

function install(aurelia) {
  aurelia.globalizeResources('./validation/validate-attached-behavior');
}