'use strict';

System.register([], function (_export, _context) {
  var Validator;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export('Validator', Validator = function () {
        function Validator() {
          _classCallCheck(this, Validator);
        }

        Validator.prototype.validate = function validate(object, prop) {
          throw new Error('A Validator must implement validate(...)');
        };

        Validator.prototype.getProperties = function getProperties() {
          throw new Error('A Validator must implement getProperties(...)');
        };

        return Validator;
      }());

      _export('Validator', Validator);
    }
  };
});