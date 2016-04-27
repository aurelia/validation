'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationEngine = undefined;

var _validationReporter = require('./validation-reporter');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationEngine = exports.ValidationEngine = function () {
  function ValidationEngine() {
    _classCallCheck(this, ValidationEngine);
  }

  ValidationEngine.getValidationReporter = function getValidationReporter(instance) {
    return instance.__validationReporter__ || (instance.__validationReporter__ = new _validationReporter.ValidationReporter());
  };

  return ValidationEngine;
}();