'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _Validation = require('../validation/validation');

var Debouncer = (function () {
  function Debouncer(debounceTimeout) {
    _classCallCheck(this, Debouncer);

    this.currentFunction = null;
    this.debounceTimeout = debounceTimeout;
  }

  Debouncer.prototype.debounce = function debounce(func) {
    var _this = this;

    this.currentFunction = func;
    setTimeout(function () {
      if (func !== null && func !== undefined) {
        if (func === _this.currentFunction) {
          _this.currentFunction = null;
          func();
        }
      }
    }, this.debounceTimeout);
  };

  return Debouncer;
})();

exports.Debouncer = Debouncer;