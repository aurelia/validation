System.register([], function (_export) {
  var _classCallCheck, _createClass, Utilities;

  return {
    setters: [],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      Utilities = (function () {
        function Utilities() {
          _classCallCheck(this, Utilities);
        }

        _createClass(Utilities, null, [{
          key: 'getValue',
          value: function getValue(val) {
            if (val !== undefined && typeof val === 'function') {
              return val();
            }
            return val;
          }
        }, {
          key: 'isEmptyValue',
          value: function isEmptyValue(val) {
            if (val === undefined) {
              return true;
            }
            if (val === null) {
              return true;
            }
            if (val === '') {
              return true;
            }
            if (typeof val === 'string') {
              if (String.prototype.trim) {
                val = val.trim();
              } else {
                val = val.replace(/^\s+|\s+$/g, '');
              }
            }

            if (val.length !== undefined) {
              return 0 === val.length;
            }
            return false;
          }
        }]);

        return Utilities;
      })();

      _export('Utilities', Utilities);

      ;
    }
  };
});