"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var AllCollections = _interopRequireWildcard(require("../validation/validationRulesCollection"));

var PathObserver = require("../validation/pathObserver").PathObserver;

var ValidationProperty = exports.ValidationProperty = (function () {
  function ValidationProperty(observerLocator, propertyName, validationGroup, propertyResult) {
    var _this = this;

    _classCallCheck(this, ValidationProperty);

    this.propertyResult = propertyResult;
    this.propertyName = propertyName;
    this.validationGroup = validationGroup;
    this.validationRules = new AllCollections.ValidationRulesCollection();

    this.observer = new PathObserver(observerLocator, validationGroup.subject, propertyName).getObserver();

    this.observer.subscribe(function (newValue, oldValue) {
      _this.validate(newValue, true);
    });
  }

  _createClass(ValidationProperty, {
    addValidationRule: {
      value: function addValidationRule(validationRule) {
        if (validationRule.validate === undefined) //Can ES6 check on base class??
          throw new exception("That's not a valid validationRule");
        this.validationRules.addValidationRule(validationRule);
        this.validateCurrentValue(false);
      }
    },
    validateCurrentValue: {
      value: function validateCurrentValue(forceDirty) {
        this.validate(this.observer.getValue(), forceDirty);
      }
    },
    validate: {
      value: function validate(newValue, shouldBeDirty) {
        var validationResponse = this.validationRules.validate(newValue);
        this.propertyResult.setValidity(validationResponse, shouldBeDirty);
      }
    }
  });

  return ValidationProperty;
})();