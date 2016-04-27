'use strict';

System.register(['./validation-reporter'], function (_export, _context) {
  var ValidationReporter, ValidationEngine;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_validationReporter) {
      ValidationReporter = _validationReporter.ValidationReporter;
    }],
    execute: function () {
      _export('ValidationEngine', ValidationEngine = function () {
        function ValidationEngine() {
          _classCallCheck(this, ValidationEngine);
        }

        ValidationEngine.getValidationReporter = function getValidationReporter(instance) {
          return instance.__validationReporter__ || (instance.__validationReporter__ = new ValidationReporter());
        };

        return ValidationEngine;
      }());

      _export('ValidationEngine', ValidationEngine);
    }
  };
});