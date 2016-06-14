'use strict';

System.register(['./validation-error'], function (_export, _context) {
  "use strict";

  var ValidationError, Validator;

  

  return {
    setters: [function (_validationError) {
      ValidationError = _validationError.ValidationError;
    }],
    execute: function () {
      _export('Validator', Validator = function () {
        function Validator() {
          
        }

        Validator.prototype.validateProperty = function validateProperty(object, propertyName) {
          var rules = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

          throw new Error('A Validator must implement validateProperty');
        };

        Validator.prototype.validateObject = function validateObject(object) {
          var rules = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

          throw new Error('A Validator must implement validateObject');
        };

        return Validator;
      }());

      _export('Validator', Validator);
    }
  };
});