System.register(['./validation/validation', './validation/utilities', './validation/validation-config', './validation/validation-locale', './validation/validation-result', './validation/validation-rules', './validation/validate-attached-behavior', './validation/validate-attached-behavior-strategy'], function (_export) {
  var Validation;

  _export('install', install);

  function install(aurelia, configCallback) {
    aurelia.globalizeResources('./validation/validate-attached-behavior');
    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(Validation.defaults);
    }
    return Validation.defaults.locale();
  }

  return {
    setters: [function (_validationValidation) {
      Validation = _validationValidation.Validation;

      _export('Validation', _validationValidation.Validation);
    }, function (_validationUtilities) {
      _export('Utilities', _validationUtilities.Utilities);
    }, function (_validationValidationConfig) {
      _export('ValidationConfig', _validationValidationConfig.ValidationConfig);
    }, function (_validationValidationLocale) {
      _export('ValidationLocale', _validationValidationLocale.ValidationLocale);
    }, function (_validationValidationResult) {
      for (var _key in _validationValidationResult) {
        _export(_key, _validationValidationResult[_key]);
      }
    }, function (_validationValidationRules) {
      for (var _key2 in _validationValidationRules) {
        _export(_key2, _validationValidationRules[_key2]);
      }
    }, function (_validationValidateAttachedBehavior) {
      _export('ValidateAttachedBehavior', _validationValidateAttachedBehavior.ValidateAttachedBehavior);
    }, function (_validationValidateAttachedBehaviorStrategy) {
      _export('ValidateAttachedBehaviorStrategy', _validationValidateAttachedBehaviorStrategy.ValidateAttachedBehaviorStrategy);
    }],
    execute: function () {
      'use strict';
    }
  };
});