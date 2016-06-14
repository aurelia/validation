'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validateBindingBehavior = require('./validate-binding-behavior');

Object.defineProperty(exports, 'ValidateBindingBehavior', {
  enumerable: true,
  get: function get() {
    return _validateBindingBehavior.ValidateBindingBehavior;
  }
});

var _validateTrigger = require('./validate-trigger');

Object.defineProperty(exports, 'validateTrigger', {
  enumerable: true,
  get: function get() {
    return _validateTrigger.validateTrigger;
  }
});

var _validationController = require('./validation-controller');

Object.defineProperty(exports, 'ValidationController', {
  enumerable: true,
  get: function get() {
    return _validationController.ValidationController;
  }
});

var _validationError = require('./validation-error');

Object.defineProperty(exports, 'ValidationError', {
  enumerable: true,
  get: function get() {
    return _validationError.ValidationError;
  }
});

var _validationErrorsCustomAttribute = require('./validation-errors-custom-attribute');

Object.defineProperty(exports, 'ValidationErrorsCustomAttribute', {
  enumerable: true,
  get: function get() {
    return _validationErrorsCustomAttribute.ValidationErrorsCustomAttribute;
  }
});

var _validationRendererCustomAttribute = require('./validation-renderer-custom-attribute');

Object.defineProperty(exports, 'ValidationRendererCustomAttribute', {
  enumerable: true,
  get: function get() {
    return _validationRendererCustomAttribute.ValidationRendererCustomAttribute;
  }
});

var _validationRenderer = require('./validation-renderer');

Object.defineProperty(exports, 'validationRenderer', {
  enumerable: true,
  get: function get() {
    return _validationRenderer.validationRenderer;
  }
});

var _validator = require('./validator');

Object.defineProperty(exports, 'Validator', {
  enumerable: true,
  get: function get() {
    return _validator.Validator;
  }
});
exports.configure = configure;
function configure(config) {
  config.globalResources('./validate-binding-behavior', './validation-errors-custom-attribute', './validation-renderer-custom-attribute');
}