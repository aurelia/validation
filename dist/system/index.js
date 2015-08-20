System.register(['./validation/validation-config', './validation/validation', './validation/utilities', './validation/validation-locale', './validation/validation-result', './validation/validation-rules', './validation/validate-custom-attribute', './validation/validate-custom-attribute-view-strategy', './validation/decorators'], function (_export) {
  'use strict';

  var ValidationConfig, Validation;

  _export('configure', configure);

  function configure(aurelia, configCallback) {

    aurelia.globalResources('./validation/validate-custom-attribute');
    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(Validation.defaults);
    }
    aurelia.singleton(ValidationConfig, Validation.defaults);
    return Validation.defaults.locale();
  }

  return {
    setters: [function (_validationValidationConfig) {
      ValidationConfig = _validationValidationConfig.ValidationConfig;

      _export('ValidationConfig', _validationValidationConfig.ValidationConfig);
    }, function (_validationValidation) {
      Validation = _validationValidation.Validation;

      _export('Validation', _validationValidation.Validation);
    }, function (_validationUtilities) {
      _export('Utilities', _validationUtilities.Utilities);
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
    }, function (_validationValidateCustomAttribute) {
      _export('ValidateCustomAttribute', _validationValidateCustomAttribute.ValidateCustomAttribute);
    }, function (_validationValidateCustomAttributeViewStrategy) {
      _export('ValidateCustomAttributeViewStrategy', _validationValidateCustomAttributeViewStrategy.ValidateCustomAttributeViewStrategy);

      _export('ValidateCustomAttributeViewStrategyBase', _validationValidateCustomAttributeViewStrategy.ValidateCustomAttributeViewStrategyBase);
    }, function (_validationDecorators) {
      _export('ensure', _validationDecorators.ensure);
    }],
    execute: function () {}
  };
});