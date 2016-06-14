define(['exports', './validate-binding-behavior', './validate-trigger', './validation-controller', './validation-error', './validation-errors-custom-attribute', './validation-renderer-custom-attribute', './validation-renderer', './validator'], function (exports, _validateBindingBehavior, _validateTrigger, _validationController, _validationError, _validationErrorsCustomAttribute, _validationRendererCustomAttribute, _validationRenderer, _validator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'ValidateBindingBehavior', {
    enumerable: true,
    get: function () {
      return _validateBindingBehavior.ValidateBindingBehavior;
    }
  });
  Object.defineProperty(exports, 'validateTrigger', {
    enumerable: true,
    get: function () {
      return _validateTrigger.validateTrigger;
    }
  });
  Object.defineProperty(exports, 'ValidationController', {
    enumerable: true,
    get: function () {
      return _validationController.ValidationController;
    }
  });
  Object.defineProperty(exports, 'ValidationError', {
    enumerable: true,
    get: function () {
      return _validationError.ValidationError;
    }
  });
  Object.defineProperty(exports, 'ValidationErrorsCustomAttribute', {
    enumerable: true,
    get: function () {
      return _validationErrorsCustomAttribute.ValidationErrorsCustomAttribute;
    }
  });
  Object.defineProperty(exports, 'ValidationRendererCustomAttribute', {
    enumerable: true,
    get: function () {
      return _validationRendererCustomAttribute.ValidationRendererCustomAttribute;
    }
  });
  Object.defineProperty(exports, 'validationRenderer', {
    enumerable: true,
    get: function () {
      return _validationRenderer.validationRenderer;
    }
  });
  Object.defineProperty(exports, 'Validator', {
    enumerable: true,
    get: function () {
      return _validator.Validator;
    }
  });
  exports.configure = configure;
  function configure(config) {
    config.globalResources('./validate-binding-behavior', './validation-errors-custom-attribute', './validation-renderer-custom-attribute');
  }
});