define(['exports', './utilities', './validation-config', './validation-locale', './validation-result', './validation-rules', './validation', './validation-group', './validate-custom-attribute', './validation-view-strategy', './strategies/twbootstrap-view-strategy', './decorators', 'aurelia-loader'], function (exports, _utilities, _validationConfig, _validationLocale, _validationResult, _validationRules, _validation, _validationGroup, _validateCustomAttribute, _validationViewStrategy, _twbootstrapViewStrategy, _decorators, _aureliaLoader) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ensure = exports.TWBootstrapViewStrategy = exports.ValidationViewStrategy = exports.ValidateCustomAttribute = exports.ValidationGroup = exports.Validation = exports.ValidationLocale = exports.ValidationConfig = exports.Utilities = undefined;
  Object.defineProperty(exports, 'Utilities', {
    enumerable: true,
    get: function () {
      return _utilities.Utilities;
    }
  });
  Object.defineProperty(exports, 'ValidationConfig', {
    enumerable: true,
    get: function () {
      return _validationConfig.ValidationConfig;
    }
  });
  Object.defineProperty(exports, 'ValidationLocale', {
    enumerable: true,
    get: function () {
      return _validationLocale.ValidationLocale;
    }
  });
  Object.keys(_validationResult).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _validationResult[key];
      }
    });
  });
  Object.keys(_validationRules).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _validationRules[key];
      }
    });
  });
  Object.defineProperty(exports, 'Validation', {
    enumerable: true,
    get: function () {
      return _validation.Validation;
    }
  });
  Object.defineProperty(exports, 'ValidationGroup', {
    enumerable: true,
    get: function () {
      return _validationGroup.ValidationGroup;
    }
  });
  Object.defineProperty(exports, 'ValidateCustomAttribute', {
    enumerable: true,
    get: function () {
      return _validateCustomAttribute.ValidateCustomAttribute;
    }
  });
  Object.defineProperty(exports, 'ValidationViewStrategy', {
    enumerable: true,
    get: function () {
      return _validationViewStrategy.ValidationViewStrategy;
    }
  });
  Object.defineProperty(exports, 'TWBootstrapViewStrategy', {
    enumerable: true,
    get: function () {
      return _twbootstrapViewStrategy.TWBootstrapViewStrategy;
    }
  });
  Object.defineProperty(exports, 'ensure', {
    enumerable: true,
    get: function () {
      return _decorators.ensure;
    }
  });
  exports.configure = configure;
  function configure(aurelia, configCallback) {
    aurelia.globalResources('./validate-custom-attribute');
    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(_validation.Validation.defaults);
    }
    aurelia.singleton(_validationConfig.ValidationConfig, _validation.Validation.defaults);
    var loader = aurelia.container.get(_aureliaLoader.Loader);
    window.loader = window.loader || loader;
    return _validation.Validation.defaults.locale();
  }
});