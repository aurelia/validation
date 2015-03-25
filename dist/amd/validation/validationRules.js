define(["exports", "../validation/validation"], function (exports, _validationValidation) {
  "use strict";

  var _get = function get(object, property, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);
      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc && desc.writable) {
      return desc.value;
    } else {
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return getter.call(receiver);
    }
  };

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var key in props) {
        var prop = props[key];
        prop.configurable = true;
        if (prop.value) prop.writable = true;
      }
      Object.defineProperties(target, props);
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var _classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Validation = _validationValidation.Validation;

  var ValidationRule = exports.ValidationRule = (function () {
    function ValidationRule(threshold, onValidate, message) {
      _classCallCheck(this, ValidationRule);

      this.onValidate = onValidate;
      this.threshold = threshold;
      this.message = message;
      this.errorMessage = null;
      this.ruleName = this.constructor.name;
    }

    _createClass(ValidationRule, {
      withMessage: {
        value: function withMessage(message) {
          this.message = message;
        }
      },
      explain: {
        value: function explain() {
          return this.errorMessage;
        }
      },
      validate: {
        value: function validate(currentValue) {
          if (typeof currentValue === "string") {
            if (String.prototype.trim) {
              currentValue = currentValue.trim();
            } else {
              currentValue = currentValue.replace(/^\s+|\s+$/g, "");
            }
          }
          var result = this.onValidate(currentValue, this.threshold);
          if (result) {
            this.errorMessage = null;
          } else {
            if (this.message) {
              if (typeof this.message === "function") {
                this.errorMessage = this.message(currentValue, this.threshold);
              } else if (typeof this.message === "string") {
                this.errorMessage = this.message;
              } else throw "Unable to handle the error message:" + this.message;
            } else {
              this.errorMessage = Validation.Locale.translate(this.ruleName, currentValue, this.threshold);
            }
          }
          return result;
        }
      }
    });

    return ValidationRule;
  })();

  var EmailValidationRule = exports.EmailValidationRule = (function (_ValidationRule) {
    function EmailValidationRule() {
      var _this = this;

      _classCallCheck(this, EmailValidationRule);

      this.emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      _get(Object.getPrototypeOf(EmailValidationRule.prototype), "constructor", this).call(this, null, function (newValue, threshold) {
        return _this.emailRegex.test(newValue);
      });
    }

    _inherits(EmailValidationRule, _ValidationRule);

    return EmailValidationRule;
  })(ValidationRule);

  var MinimumLengthValidationRule = exports.MinimumLengthValidationRule = (function (_ValidationRule2) {
    function MinimumLengthValidationRule(minimumLength) {
      _classCallCheck(this, MinimumLengthValidationRule);

      _get(Object.getPrototypeOf(MinimumLengthValidationRule.prototype), "constructor", this).call(this, minimumLength, function (newValue, minimumLength) {
        return newValue.length !== undefined && newValue.length >= minimumLength;
      });
    }

    _inherits(MinimumLengthValidationRule, _ValidationRule2);

    return MinimumLengthValidationRule;
  })(ValidationRule);

  var MaximumLengthValidationRule = exports.MaximumLengthValidationRule = (function (_ValidationRule3) {
    function MaximumLengthValidationRule(maximumLength) {
      _classCallCheck(this, MaximumLengthValidationRule);

      _get(Object.getPrototypeOf(MaximumLengthValidationRule.prototype), "constructor", this).call(this, maximumLength, function (newValue, maximumLength) {
        return newValue.length !== undefined && newValue.length < maximumLength;
      });
    }

    _inherits(MaximumLengthValidationRule, _ValidationRule3);

    return MaximumLengthValidationRule;
  })(ValidationRule);

  var BetweenLengthValidationRule = exports.BetweenLengthValidationRule = (function (_ValidationRule4) {
    function BetweenLengthValidationRule(minimumLength, maximumLength) {
      _classCallCheck(this, BetweenLengthValidationRule);

      _get(Object.getPrototypeOf(BetweenLengthValidationRule.prototype), "constructor", this).call(this, {
        minimumLength: minimumLength,
        maximumLength: maximumLength
      }, function (newValue, threshold) {
        return newValue.length !== undefined && newValue.length >= threshold.minimumLength && newValue.length < threshold.maximumLength;
      });
    }

    _inherits(BetweenLengthValidationRule, _ValidationRule4);

    return BetweenLengthValidationRule;
  })(ValidationRule);

  var CustomFunctionValidationRule = exports.CustomFunctionValidationRule = (function (_ValidationRule5) {
    function CustomFunctionValidationRule(customFunction, threshold) {
      _classCallCheck(this, CustomFunctionValidationRule);

      _get(Object.getPrototypeOf(CustomFunctionValidationRule.prototype), "constructor", this).call(this, threshold, customFunction);
    }

    _inherits(CustomFunctionValidationRule, _ValidationRule5);

    return CustomFunctionValidationRule;
  })(ValidationRule);

  var NumericValidationRule = exports.NumericValidationRule = (function (_ValidationRule6) {
    function NumericValidationRule() {
      _classCallCheck(this, NumericValidationRule);

      _get(Object.getPrototypeOf(NumericValidationRule.prototype), "constructor", this).call(this, null, function (newValue) {
        var numericRegex = Validation.Locale.setting("numericRegex");
        var floatValue = parseFloat(newValue);
        return !Number.isNaN(parseFloat(floatValue)) && Number.isFinite(floatValue) && numericRegex.test(newValue);
      });
    }

    _inherits(NumericValidationRule, _ValidationRule6);

    return NumericValidationRule;
  })(ValidationRule);

  var RegexValidationRule = exports.RegexValidationRule = (function (_ValidationRule7) {
    function RegexValidationRule(regex) {
      _classCallCheck(this, RegexValidationRule);

      _get(Object.getPrototypeOf(RegexValidationRule.prototype), "constructor", this).call(this, regex, function (newValue, regex) {
        return regex.test(newValue);
      });
    }

    _inherits(RegexValidationRule, _ValidationRule7);

    return RegexValidationRule;
  })(ValidationRule);

  var MinimumValueValidationRule = exports.MinimumValueValidationRule = (function (_ValidationRule8) {
    function MinimumValueValidationRule(minimumValue) {
      _classCallCheck(this, MinimumValueValidationRule);

      _get(Object.getPrototypeOf(MinimumValueValidationRule.prototype), "constructor", this).call(this, minimumValue, function (newValue, minimumValue) {
        return minimumValue <= newValue;
      });
    }

    _inherits(MinimumValueValidationRule, _ValidationRule8);

    return MinimumValueValidationRule;
  })(ValidationRule);

  var MaximumValueValidationRule = exports.MaximumValueValidationRule = (function (_ValidationRule9) {
    function MaximumValueValidationRule(maximumValue) {
      _classCallCheck(this, MaximumValueValidationRule);

      _get(Object.getPrototypeOf(MaximumValueValidationRule.prototype), "constructor", this).call(this, maximumValue, function (newValue, maximumValue) {
        return newValue < maximumValue;
      });
    }

    _inherits(MaximumValueValidationRule, _ValidationRule9);

    return MaximumValueValidationRule;
  })(ValidationRule);

  var BetweenValueValidationRule = exports.BetweenValueValidationRule = (function (_ValidationRule10) {
    function BetweenValueValidationRule(minimumValue, maximumValue) {
      _classCallCheck(this, BetweenValueValidationRule);

      _get(Object.getPrototypeOf(BetweenValueValidationRule.prototype), "constructor", this).call(this, {
        minimumValue: minimumValue,
        maximumValue: maximumValue
      }, function (newValue, threshold) {
        return threshold.minimumValue <= newValue && newValue < threshold.maximumValue;
      });
    }

    _inherits(BetweenValueValidationRule, _ValidationRule10);

    return BetweenValueValidationRule;
  })(ValidationRule);

  var DigitValidationRule = exports.DigitValidationRule = (function (_ValidationRule11) {
    function DigitValidationRule() {
      var _this = this;

      _classCallCheck(this, DigitValidationRule);

      this.digitRegex = /^\d+$/;
      _get(Object.getPrototypeOf(DigitValidationRule.prototype), "constructor", this).call(this, null, function (newValue, threshold) {
        return _this.digitRegex.test(newValue);
      });
    }

    _inherits(DigitValidationRule, _ValidationRule11);

    return DigitValidationRule;
  })(ValidationRule);

  var AlphaNumericValidationRule = exports.AlphaNumericValidationRule = (function (_ValidationRule12) {
    function AlphaNumericValidationRule() {
      var _this = this;

      _classCallCheck(this, AlphaNumericValidationRule);

      this.alphaNumericRegex = /^[a-z0-9]+$/i;
      _get(Object.getPrototypeOf(AlphaNumericValidationRule.prototype), "constructor", this).call(this, null, function (newValue, threshold) {
        return _this.alphaNumericRegex.test(newValue);
      });
    }

    _inherits(AlphaNumericValidationRule, _ValidationRule12);

    return AlphaNumericValidationRule;
  })(ValidationRule);

  var AlphaNumericOrWhitespaceValidationRule = exports.AlphaNumericOrWhitespaceValidationRule = (function (_ValidationRule13) {
    function AlphaNumericOrWhitespaceValidationRule() {
      var _this = this;

      _classCallCheck(this, AlphaNumericOrWhitespaceValidationRule);

      this.alphaNumericRegex = /^[a-z0-9\s]+$/i;
      _get(Object.getPrototypeOf(AlphaNumericOrWhitespaceValidationRule.prototype), "constructor", this).call(this, null, function (newValue, threshold) {
        return _this.alphaNumericRegex.test(newValue);
      });
    }

    _inherits(AlphaNumericOrWhitespaceValidationRule, _ValidationRule13);

    return AlphaNumericOrWhitespaceValidationRule;
  })(ValidationRule);

  var StrongPasswordValidationRule = exports.StrongPasswordValidationRule = (function (_ValidationRule14) {
    function StrongPasswordValidationRule(minimumComplexityLevel) {
      _classCallCheck(this, StrongPasswordValidationRule);

      var complexityLevel = 4;
      if (minimumComplexityLevel && minimumComplexityLevel > 1 && minimumComplexityLevel < 4) complexityLevel = minimumComplexityLevel;

      _get(Object.getPrototypeOf(StrongPasswordValidationRule.prototype), "constructor", this).call(this, complexityLevel, function (newValue, threshold) {
        if (typeof newValue !== "string") return false;
        var strength = 0;

        strength += /[A-Z]+/.test(newValue) ? 1 : 0;
        strength += /[a-z]+/.test(newValue) ? 1 : 0;
        strength += /[0-9]+/.test(newValue) ? 1 : 0;
        strength += /[\W]+/.test(newValue) ? 1 : 0;
        return strength >= threshold;
      });
    }

    _inherits(StrongPasswordValidationRule, _ValidationRule14);

    return StrongPasswordValidationRule;
  })(ValidationRule);

  var EqualityValidationRule = exports.EqualityValidationRule = (function (_ValidationRule15) {
    function EqualityValidationRule(otherValue, equality, otherValueLabel) {
      _classCallCheck(this, EqualityValidationRule);

      _get(Object.getPrototypeOf(EqualityValidationRule.prototype), "constructor", this).call(this, {
        otherValue: otherValue,
        equality: equality,
        otherValueLabel: otherValueLabel
      }, function (newValue, threshold) {
        if (newValue instanceof Date && threshold.otherValue instanceof Date) return threshold.equality === (newValue.getTime() === threshold.otherValue.getTime());
        return threshold.equality === (newValue === threshold.otherValue);
      });
    }

    _inherits(EqualityValidationRule, _ValidationRule15);

    return EqualityValidationRule;
  })(ValidationRule);

  var InCollectionValidationRule = exports.InCollectionValidationRule = (function (_ValidationRule16) {
    function InCollectionValidationRule(collection) {
      _classCallCheck(this, InCollectionValidationRule);

      _get(Object.getPrototypeOf(InCollectionValidationRule.prototype), "constructor", this).call(this, collection, function (newValue, threshold) {
        for (var i = 0; i < collection.length; i++) {
          if (newValue === collection[i]) return true;
        }
        return false;
      });
    }

    _inherits(InCollectionValidationRule, _ValidationRule16);

    return InCollectionValidationRule;
  })(ValidationRule);
});
