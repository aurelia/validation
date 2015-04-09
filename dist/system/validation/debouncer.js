System.register(['../validation/validation'], function (_export) {
  var Validation, _classCallCheck, _createClass, Debouncer;

  return {
    setters: [function (_validationValidation) {
      Validation = _validationValidation.Validation;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      Debouncer = (function () {
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
            }, Validation.debounceTime);
          }
        }]);

        return Debouncer;
      })();

      _export('Debouncer', Debouncer);
    }
  };
});