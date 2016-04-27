'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validator = require('./validator');

Object.defineProperty(exports, 'Validator', {
  enumerable: true,
  get: function get() {
    return _validator.Validator;
  }
});

var _validationReporter = require('./validation-reporter');

Object.defineProperty(exports, 'ValidationReporter', {
  enumerable: true,
  get: function get() {
    return _validationReporter.ValidationReporter;
  }
});

var _validationEngine = require('./validation-engine');

Object.defineProperty(exports, 'ValidationEngine', {
  enumerable: true,
  get: function get() {
    return _validationEngine.ValidationEngine;
  }
});
exports.configure = configure;
function configure(config) {}