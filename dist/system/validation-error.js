'use strict';

System.register([], function (_export, _context) {
  var ValidationError;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export('ValidationError', ValidationError = function ValidationError(data) {
        _classCallCheck(this, ValidationError);

        this.message = '';
        this.propertyName = '';

        Object.assign(this, data);
      });

      _export('ValidationError', ValidationError);
    }
  };
});