'use strict';

System.register(['./validate-binding-behavior', './validate-trigger', './validation-controller', './validation-error', './validation-errors-custom-attribute', './validation-renderer-custom-attribute', './validation-renderer', './validator'], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_validateBindingBehavior) {
      var _exportObj = {};
      _exportObj.ValidateBindingBehavior = _validateBindingBehavior.ValidateBindingBehavior;

      _export(_exportObj);
    }, function (_validateTrigger) {
      var _exportObj2 = {};
      _exportObj2.validateTrigger = _validateTrigger.validateTrigger;

      _export(_exportObj2);
    }, function (_validationController) {
      var _exportObj3 = {};
      _exportObj3.ValidationController = _validationController.ValidationController;

      _export(_exportObj3);
    }, function (_validationError) {
      var _exportObj4 = {};
      _exportObj4.ValidationError = _validationError.ValidationError;

      _export(_exportObj4);
    }, function (_validationErrorsCustomAttribute) {
      var _exportObj5 = {};
      _exportObj5.ValidationErrorsCustomAttribute = _validationErrorsCustomAttribute.ValidationErrorsCustomAttribute;

      _export(_exportObj5);
    }, function (_validationRendererCustomAttribute) {
      var _exportObj6 = {};
      _exportObj6.ValidationRendererCustomAttribute = _validationRendererCustomAttribute.ValidationRendererCustomAttribute;

      _export(_exportObj6);
    }, function (_validationRenderer) {
      var _exportObj7 = {};
      _exportObj7.validationRenderer = _validationRenderer.validationRenderer;

      _export(_exportObj7);
    }, function (_validator) {
      var _exportObj8 = {};
      _exportObj8.Validator = _validator.Validator;

      _export(_exportObj8);
    }],
    execute: function () {
      function configure(config) {
        config.globalResources('./validate-binding-behavior', './validation-errors-custom-attribute', './validation-renderer-custom-attribute');
      }

      _export('configure', configure);
    }
  };
});