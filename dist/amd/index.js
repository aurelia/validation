define(['exports', './validator', './validation-reporter', './validation-engine', './validation-error'], function (exports, _validator, _validationReporter, _validationEngine, _validationError) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'Validator', {
    enumerable: true,
    get: function () {
      return _validator.Validator;
    }
  });
  Object.defineProperty(exports, 'ValidationReporter', {
    enumerable: true,
    get: function () {
      return _validationReporter.ValidationReporter;
    }
  });
  Object.defineProperty(exports, 'ValidationEngine', {
    enumerable: true,
    get: function () {
      return _validationEngine.ValidationEngine;
    }
  });
  Object.defineProperty(exports, 'ValidationError', {
    enumerable: true,
    get: function () {
      return _validationError.ValidationError;
    }
  });
  exports.configure = configure;
  function configure(config) {}
});