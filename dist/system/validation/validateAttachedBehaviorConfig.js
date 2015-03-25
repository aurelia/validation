System.register([], function (_export) {
  var _classCallCheck, ValidateAttachedBehaviorConfig;

  return {
    setters: [],
    execute: function () {
      "use strict";

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      ValidateAttachedBehaviorConfig = _export("ValidateAttachedBehaviorConfig", function ValidateAttachedBehaviorConfig() {
        _classCallCheck(this, ValidateAttachedBehaviorConfig);

        this.bindingPathAttributes = ["validate", "value.bind", "value.two-way"];
        this.appendMessageToLabel = true;
        this.appendMessageToInput = false;
      });
    }
  };
});