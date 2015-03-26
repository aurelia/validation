define(["exports", "./validation/validation-locale-repository", "./validation/validation-result", "./validation/validation-rules", "./validation/validation-rules-collection", "./validation/validation-group-builder", "./validation/validation", "./validation/validate-attached-behavior", "./validation/validate-attached-behavior-config"], function (exports, _validationValidationLocaleRepository, _validationValidationResult, _validationValidationRules, _validationValidationRulesCollection, _validationValidationGroupBuilder, _validationValidation, _validationValidateAttachedBehavior, _validationValidateAttachedBehaviorConfig) {
  "use strict";

  var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

  var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

  exports.install = install;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  _defaults(exports, _interopRequireWildcard(_validationValidationLocaleRepository));

  _defaults(exports, _interopRequireWildcard(_validationValidationResult));

  _defaults(exports, _interopRequireWildcard(_validationValidationRules));

  _defaults(exports, _interopRequireWildcard(_validationValidationRulesCollection));

  _defaults(exports, _interopRequireWildcard(_validationValidationGroupBuilder));

  _defaults(exports, _interopRequireWildcard(_validationValidation));

  _defaults(exports, _interopRequireWildcard(_validationValidateAttachedBehavior));

  _defaults(exports, _interopRequireWildcard(_validationValidateAttachedBehaviorConfig));

  function install(aurelia) {
    aurelia.globalizeResources("./validation/validate-attached-behavior");
  }
});