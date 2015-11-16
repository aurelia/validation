System.register(['./validation-config', './validation', './utilities', './validation-locale', './validation-result', './validation-rules', './validation-group', './validate-custom-attribute', './validation-view-strategy', './strategies/twbootstrap-view-strategy', './decorators'], function (_export) {
  'use strict';

  var ValidationConfig, Validation;

  _export('configure', configure);

  function configure(aurelia, configCallback) {
    aurelia.globalResources('./validate-custom-attribute');
    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(Validation.defaults);
    }
    aurelia.singleton(ValidationConfig, Validation.defaults);
    return Validation.defaults.locale();
  }

  return {
    setters: [function (_validationConfig) {
      ValidationConfig = _validationConfig.ValidationConfig;

      _export('ValidationConfig', _validationConfig.ValidationConfig);
    }, function (_validation) {
      Validation = _validation.Validation;

      _export('Validation', _validation.Validation);
    }, function (_utilities) {
      _export('Utilities', _utilities.Utilities);
    }, function (_validationLocale) {
      _export('ValidationLocale', _validationLocale.ValidationLocale);
    }, function (_validationResult) {
      for (var _key in _validationResult) {
        if (_key !== 'default') _export(_key, _validationResult[_key]);
      }
    }, function (_validationRules) {
      for (var _key2 in _validationRules) {
        if (_key2 !== 'default') _export(_key2, _validationRules[_key2]);
      }
    }, function (_validationGroup) {
      _export('ValidationGroup', _validationGroup.ValidationGroup);
    }, function (_validateCustomAttribute) {
      _export('ValidateCustomAttribute', _validateCustomAttribute.ValidateCustomAttribute);
    }, function (_validationViewStrategy) {
      _export('ValidationViewStrategy', _validationViewStrategy.ValidationViewStrategy);
    }, function (_strategiesTwbootstrapViewStrategy) {
      _export('TWBootstrapViewStrategy', _strategiesTwbootstrapViewStrategy.TWBootstrapViewStrategy);
    }, function (_decorators) {
      _export('ensure', _decorators.ensure);
    }],
    execute: function () {}
  };
});