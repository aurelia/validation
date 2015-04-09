define(['exports', '../validation'], function (exports, _validation) {
  'use strict';

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var Debouncer = (function () {
    function Debouncer() {
      _classCallCheck(this, Debouncer);

      this.currentFunction = null;
    }

    _createClass(Debouncer, [{
      key: 'debounce',
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
        }, _validation.Validation.debounceTime);
      }
    }]);

    return Debouncer;
  })();

  exports.Debouncer = Debouncer;
});