"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Validation = require("../validation").Validation;

var Debouncer = exports.Debouncer = (function () {
  function Debouncer() {
    _classCallCheck(this, Debouncer);

    this.currentFunction = null;
  }

  _createClass(Debouncer, {
    debounce: {
      value: function debounce(func) {
        var _this = this;

        this.currentFunction = func;
        setTimeout(function () {
          if (func !== null && func !== undefined) {
            if (func === _this.currentFunction) {
              _this.currentFunction = null;
              func();
            }
          }
        }, Validation.debounceTime);
      }
    }
  });

  return Debouncer;
})();