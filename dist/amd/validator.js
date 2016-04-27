define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Validator = exports.Validator = function () {
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
  }();
});