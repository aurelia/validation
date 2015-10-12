System.register([], function (_export) {
  "use strict";

  var Debouncer;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [],
    execute: function () {
      Debouncer = (function () {
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

      _export("Debouncer", Debouncer);
    }
  };
});