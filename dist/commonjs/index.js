'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensure = exports.TWBootstrapViewStrategy = exports.ValidationViewStrategy = exports.ValidateCustomAttribute = exports.ValidationGroup = exports.Validation = exports.ValidationLocale = exports.ValidationConfig = exports.Utilities = undefined;

var _utilities = require('./utilities');

Object.defineProperty(exports, 'Utilities', {
  enumerable: true,
  get: function get() {
    return _utilities.Utilities;
  }
});

var _validationConfig = require('./validation-config');

Object.defineProperty(exports, 'ValidationConfig', {
  enumerable: true,
  get: function get() {
    return _validationConfig.ValidationConfig;
  }
});

var _validationLocale = require('./validation-locale');

Object.defineProperty(exports, 'ValidationLocale', {
  enumerable: true,
  get: function get() {
    return _validationLocale.ValidationLocale;
  }
});

var _validationResult = require('./validation-result');

Object.keys(_validationResult).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _validationResult[key];
    }
  });
});

var _validationRules = require('./validation-rules');

Object.keys(_validationRules).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _validationRules[key];
    }
  });
});

var _validation = require('./validation');

Object.defineProperty(exports, 'Validation', {
  enumerable: true,
  get: function get() {
    return _validation.Validation;
  }
});

var _validationGroup = require('./validation-group');

Object.defineProperty(exports, 'ValidationGroup', {
  enumerable: true,
  get: function get() {
    return _validationGroup.ValidationGroup;
  }
});

var _validateCustomAttribute = require('./validate-custom-attribute');

Object.defineProperty(exports, 'ValidateCustomAttribute', {
  enumerable: true,
  get: function get() {
    return _validateCustomAttribute.ValidateCustomAttribute;
  }
});

var _validationViewStrategy = require('./validation-view-strategy');

Object.defineProperty(exports, 'ValidationViewStrategy', {
  enumerable: true,
  get: function get() {
    return _validationViewStrategy.ValidationViewStrategy;
  }
});

var _twbootstrapViewStrategy = require('./strategies/twbootstrap-view-strategy');

Object.defineProperty(exports, 'TWBootstrapViewStrategy', {
  enumerable: true,
  get: function get() {
    return _twbootstrapViewStrategy.TWBootstrapViewStrategy;
  }
});

var _decorators = require('./decorators');

Object.defineProperty(exports, 'ensure', {
  enumerable: true,
  get: function get() {
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
  return _validation.Validation.defaults.locale();
}