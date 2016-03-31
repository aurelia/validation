'use strict';

System.register(['./utilities', './validation-config', './validation-locale', './validation-result', './validation-rules', './validation', './validation-group', './validate-custom-attribute', './validation-view-strategy', './strategies/twbootstrap-view-strategy', './decorators', 'aurelia-loader'], function (_export, _context) {
  var Loader, ValidationConfig, Validation;
  return {
    setters: [function (_utilities) {
      var _exportObj = {};
      _exportObj.Utilities = _utilities.Utilities;

      _export(_exportObj);
    }, function (_validationConfig) {
      ValidationConfig = _validationConfig.ValidationConfig;
      var _exportObj2 = {};
      _exportObj2.ValidationConfig = _validationConfig.ValidationConfig;

      _export(_exportObj2);
    }, function (_validationLocale) {
      var _exportObj3 = {};
      _exportObj3.ValidationLocale = _validationLocale.ValidationLocale;

      _export(_exportObj3);
    }, function (_validationResult) {
      var _exportObj4 = {};

      for (var _key in _validationResult) {
        if (_key !== "default") _exportObj4[_key] = _validationResult[_key];
      }

      _export(_exportObj4);
    }, function (_validationRules) {
      var _exportObj5 = {};

      for (var _key2 in _validationRules) {
        if (_key2 !== "default") _exportObj5[_key2] = _validationRules[_key2];
      }

      _export(_exportObj5);
    }, function (_validation) {
      Validation = _validation.Validation;
      var _exportObj6 = {};
      _exportObj6.Validation = _validation.Validation;

      _export(_exportObj6);
    }, function (_validationGroup) {
      var _exportObj7 = {};
      _exportObj7.ValidationGroup = _validationGroup.ValidationGroup;

      _export(_exportObj7);
    }, function (_validateCustomAttribute) {
      var _exportObj8 = {};
      _exportObj8.ValidateCustomAttribute = _validateCustomAttribute.ValidateCustomAttribute;

      _export(_exportObj8);
    }, function (_validationViewStrategy) {
      var _exportObj9 = {};
      _exportObj9.ValidationViewStrategy = _validationViewStrategy.ValidationViewStrategy;

      _export(_exportObj9);
    }, function (_strategiesTwbootstrapViewStrategy) {
      var _exportObj10 = {};
      _exportObj10.TWBootstrapViewStrategy = _strategiesTwbootstrapViewStrategy.TWBootstrapViewStrategy;

      _export(_exportObj10);
    }, function (_decorators) {
      var _exportObj11 = {};
      _exportObj11.ensure = _decorators.ensure;

      _export(_exportObj11);
    }, function (_aureliaLoader) {
      Loader = _aureliaLoader.Loader;
    }],
    execute: function () {
      function configure(aurelia, configCallback) {
        aurelia.globalResources('./validate-custom-attribute');
        if (configCallback !== undefined && typeof configCallback === 'function') {
          configCallback(Validation.defaults);
        }
        aurelia.singleton(ValidationConfig, Validation.defaults);
        var loader = aurelia.container.get(Loader);
        window.loader = window.loader || loader;
        return Validation.defaults.locale();
      }

      _export('configure', configure);
    }
  };
});