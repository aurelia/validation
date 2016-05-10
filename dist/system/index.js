'use strict';

System.register(['./validator', './validation-reporter', './validation-engine', './validation-error'], function (_export, _context) {
  return {
    setters: [function (_validator) {
      var _exportObj = {};
      _exportObj.Validator = _validator.Validator;

      _export(_exportObj);
    }, function (_validationReporter) {
      var _exportObj2 = {};
      _exportObj2.ValidationReporter = _validationReporter.ValidationReporter;

      _export(_exportObj2);
    }, function (_validationEngine) {
      var _exportObj3 = {};
      _exportObj3.ValidationEngine = _validationEngine.ValidationEngine;

      _export(_exportObj3);
    }, function (_validationError) {
      var _exportObj4 = {};
      _exportObj4.ValidationError = _validationError.ValidationError;

      _export(_exportObj4);
    }],
    execute: function () {
      function configure(config) {}

      _export('configure', configure);
    }
  };
});