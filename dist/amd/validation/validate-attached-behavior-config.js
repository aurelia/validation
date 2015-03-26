define(["exports"], function (exports) {
  "use strict";

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var ValidateAttachedBehaviorConfig = exports.ValidateAttachedBehaviorConfig = function ValidateAttachedBehaviorConfig() {
    _classCallCheck(this, ValidateAttachedBehaviorConfig);

    this.bindingPathAttributes = ["validate", "value.bind", "value.two-way"];
    this.appendMessageToLabel = true;
    this.appendMessageToInput = false;
  };
});