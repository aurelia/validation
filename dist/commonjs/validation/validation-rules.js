'use strict';

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _Utilities = require('../validation/utilities');

var _ValidationLocale = require('../validation/validation-locale');

var ValidationRule = (function () {
  function ValidationRule(threshold, onValidate, message) {
    _classCallCheck(this, ValidationRule);

    this.onValidate = onValidate;
    this.threshold = threshold;
    this.message = message;
    this.errorMessage = null;
    this.ruleName = this.constructor.name;
  }

  ValidationRule.prototype.withMessage = function withMessage(message) {
    this.message = message;
  };

  ValidationRule.prototype.explain = function explain() {
    return this.errorMessage;
  };

  ValidationRule.prototype.setResult = function setResult(result, currentValue, locale) {
    if (result === true || result === undefined || result === null || result === '') {
      this.errorMessage = null;
      return true;
    } else {
      if (typeof result === 'string') {
        this.errorMessage = result;
      } else {
        if (this.message) {
          if (typeof this.message === 'function') {
            this.errorMessage = this.message(currentValue, this.threshold);
          } else if (typeof this.message === 'string') {
            this.errorMessage = this.message;
          } else throw 'Unable to handle the error message:' + this.message;
        } else {
          this.errorMessage = locale.translate(this.ruleName, currentValue, this.threshold);
        }
      }
      return false;
    }
  };

  ValidationRule.prototype.validate = function validate(currentValue, locale) {
    var _this = this;

    if (locale === undefined) {
      locale = _ValidationLocale.ValidationLocale.Repository['default'];
    }

    currentValue = _Utilities.Utilities.getValue(currentValue);
    var result = this.onValidate(currentValue, this.threshold, locale);
    var promise = Promise.resolve(result);

    var nextPromise = promise.then(function (promiseResult) {
      return _this.setResult(promiseResult, currentValue, locale);
    }, function (promiseFailure) {
      if (typeof promiseFailure === 'string' && promiseFailure !== '') return _this.setResult(promiseFailure, currentValue, locale);else return _this.setResult(false, currentValue, locale);
    });
    return nextPromise;
  };

  return ValidationRule;
})();

exports.ValidationRule = ValidationRule;

var URLValidationRule = (function (_ValidationRule) {
  function URLValidationRule(threshold) {
    var _this2 = this;

    _classCallCheck(this, URLValidationRule);

    var default_url_options = {
      protocols: ['http', 'https', 'ftp'],
      require_tld: true,
      require_protocol: false,
      allow_underscores: true,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: true
    };
    if (threshold === undefined) {
      threshold = default_url_options;
    }

    _ValidationRule.call(this, threshold, function (newValue, threshold) {
      var url = newValue;
      if (!url || url.length >= 2083 || /\s/.test(url)) {
        return false;
      }
      if (url.indexOf('mailto:') === 0) {
        return false;
      }
      var protocol, auth, host, hostname, port, port_str, split;
      split = url.split('://');
      if (split.length > 1) {
        protocol = split.shift();
        if (threshold.protocols.indexOf(protocol) === -1) {
          return false;
        }
      } else if (threshold.require_protocol) {
        return false;
      } else if (threshold.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
        split[0] = url.substr(2);
      }
      url = split.join('://');
      split = url.split('#');
      url = split.shift();

      split = url.split('?');
      url = split.shift();

      split = url.split('/');
      url = split.shift();
      split = url.split('@');
      if (split.length > 1) {
        auth = split.shift();
        if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
          return false;
        }
      }
      hostname = split.join('@');
      split = hostname.split(':');
      host = split.shift();
      if (split.length) {
        port_str = split.join(':');
        port = parseInt(port_str, 10);
        if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
          return false;
        }
      }
      if (!_this2.isIP(host) && !_this2.isFQDN(host, threshold) && host !== 'localhost') {
        return false;
      }
      if (threshold.host_whitelist && threshold.host_whitelist.indexOf(host) === -1) {
        return false;
      }
      if (threshold.host_blacklist && threshold.host_blacklist.indexOf(host) !== -1) {
        return false;
      }
      return true;
    });
    this.isIP = function (str, version) {
      var ipv4Maybe = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
          ipv6Block = /^[0-9A-F]{1,4}$/i;

      if (!version) {
        return this.isIP(str, 4) || this.isIP(str, 6);
      } else if (version === 4) {
        if (!ipv4Maybe.test(str)) {
          return false;
        }
        var parts = str.split('.').sort(function (a, b) {
          return a - b;
        });
        return parts[3] <= 255;
      } else if (version === 6) {
        var blocks = str.split(':');
        var foundOmissionBlock = false;

        if (blocks.length > 8) return false;

        if (str === '::') {
          return true;
        } else if (str.substr(0, 2) === '::') {
          blocks.shift();
          blocks.shift();
          foundOmissionBlock = true;
        } else if (str.substr(str.length - 2) === '::') {
          blocks.pop();
          blocks.pop();
          foundOmissionBlock = true;
        }

        for (var i = 0; i < blocks.length; ++i) {
          if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
            if (foundOmissionBlock) return false;
            foundOmissionBlock = true;
          } else if (!ipv6Block.test(blocks[i])) {
            return false;
          }
        }

        if (foundOmissionBlock) {
          return blocks.length >= 1;
        } else {
          return blocks.length === 8;
        }
      }
      return false;
    };
    this.isFQDN = function (str, options) {
      if (options.allow_trailing_dot && str[str.length - 1] === '.') {
        str = str.substring(0, str.length - 1);
      }
      var parts = str.split('.');
      if (options.require_tld) {
        var tld = parts.pop();
        if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
          return false;
        }
      }
      for (var part, i = 0; i < parts.length; i++) {
        part = parts[i];
        if (options.allow_underscores) {
          if (part.indexOf('__') >= 0) {
            return false;
          }
          part = part.replace(/_/g, '');
        }
        if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
          return false;
        }
        if (part[0] === '-' || part[part.length - 1] === '-' || part.indexOf('---') >= 0) {
          return false;
        }
      }
      return true;
    };
  }

  _inherits(URLValidationRule, _ValidationRule);

  return URLValidationRule;
})(ValidationRule);

exports.URLValidationRule = URLValidationRule;

var EmailValidationRule = (function (_ValidationRule2) {
  function EmailValidationRule() {
    var _this3 = this;

    _classCallCheck(this, EmailValidationRule);

    _ValidationRule2.call(this, null, function (newValue, threshold) {
      if (/\s/.test(newValue)) {
        return false;
      }
      var parts = newValue.split('@');
      var domain = parts.pop();
      var user = parts.join('@');

      if (!_this3.isFQDN(domain)) {
        return false;
      }
      return _this3.emailUserUtf8Regex.test(user);
    });
    this.emailUserUtf8Regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i;
    this.isFQDN = function (str) {
      var parts = str.split('.');
      for (var part, i = 0; i < parts.length; i++) {
        part = parts[i];
        if (part.indexOf('__') >= 0) {
          return false;
        }
        part = part.replace(/_/g, '');
        if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
          return false;
        }
        if (part[0] === '-' || part[part.length - 1] === '-' || part.indexOf('---') >= 0) {
          return false;
        }
      }
      return true;
    };
  }

  _inherits(EmailValidationRule, _ValidationRule2);

  return EmailValidationRule;
})(ValidationRule);

exports.EmailValidationRule = EmailValidationRule;

var MinimumLengthValidationRule = (function (_ValidationRule3) {
  function MinimumLengthValidationRule(minimumLength) {
    _classCallCheck(this, MinimumLengthValidationRule);

    _ValidationRule3.call(this, minimumLength, function (newValue, minimumLength) {
      return newValue.length !== undefined && newValue.length >= minimumLength;
    });
  }

  _inherits(MinimumLengthValidationRule, _ValidationRule3);

  return MinimumLengthValidationRule;
})(ValidationRule);

exports.MinimumLengthValidationRule = MinimumLengthValidationRule;

var MaximumLengthValidationRule = (function (_ValidationRule4) {
  function MaximumLengthValidationRule(maximumLength) {
    _classCallCheck(this, MaximumLengthValidationRule);

    _ValidationRule4.call(this, maximumLength, function (newValue, maximumLength) {
      return newValue.length !== undefined && newValue.length <= maximumLength;
    });
  }

  _inherits(MaximumLengthValidationRule, _ValidationRule4);

  return MaximumLengthValidationRule;
})(ValidationRule);

exports.MaximumLengthValidationRule = MaximumLengthValidationRule;

var BetweenLengthValidationRule = (function (_ValidationRule5) {
  function BetweenLengthValidationRule(minimumLength, maximumLength) {
    _classCallCheck(this, BetweenLengthValidationRule);

    _ValidationRule5.call(this, { minimumLength: minimumLength, maximumLength: maximumLength }, function (newValue, threshold) {
      return newValue.length !== undefined && newValue.length >= threshold.minimumLength && newValue.length <= threshold.maximumLength;
    });
  }

  _inherits(BetweenLengthValidationRule, _ValidationRule5);

  return BetweenLengthValidationRule;
})(ValidationRule);

exports.BetweenLengthValidationRule = BetweenLengthValidationRule;

var CustomFunctionValidationRule = (function (_ValidationRule6) {
  function CustomFunctionValidationRule(customFunction, threshold) {
    _classCallCheck(this, CustomFunctionValidationRule);

    _ValidationRule6.call(this, threshold, customFunction);
  }

  _inherits(CustomFunctionValidationRule, _ValidationRule6);

  return CustomFunctionValidationRule;
})(ValidationRule);

exports.CustomFunctionValidationRule = CustomFunctionValidationRule;

var NumericValidationRule = (function (_ValidationRule7) {
  function NumericValidationRule() {
    _classCallCheck(this, NumericValidationRule);

    _ValidationRule7.call(this, null, function (newValue, threshold, locale) {
      var numericRegex = locale.setting('numericRegex');
      var floatValue = parseFloat(newValue);
      return !Number.isNaN(parseFloat(newValue)) && Number.isFinite(floatValue) && numericRegex.test(newValue);
    });
  }

  _inherits(NumericValidationRule, _ValidationRule7);

  return NumericValidationRule;
})(ValidationRule);

exports.NumericValidationRule = NumericValidationRule;

var RegexValidationRule = (function (_ValidationRule8) {
  function RegexValidationRule(regex) {
    _classCallCheck(this, RegexValidationRule);

    _ValidationRule8.call(this, regex, function (newValue, regex) {
      return regex.test(newValue);
    });
  }

  _inherits(RegexValidationRule, _ValidationRule8);

  return RegexValidationRule;
})(ValidationRule);

exports.RegexValidationRule = RegexValidationRule;

var ContainsOnlyValidationRule = (function (_RegexValidationRule) {
  function ContainsOnlyValidationRule(regex) {
    _classCallCheck(this, ContainsOnlyValidationRule);

    _RegexValidationRule.call(this, regex);
  }

  _inherits(ContainsOnlyValidationRule, _RegexValidationRule);

  return ContainsOnlyValidationRule;
})(RegexValidationRule);

exports.ContainsOnlyValidationRule = ContainsOnlyValidationRule;

var MinimumValueValidationRule = (function (_ValidationRule9) {
  function MinimumValueValidationRule(minimumValue) {
    _classCallCheck(this, MinimumValueValidationRule);

    _ValidationRule9.call(this, minimumValue, function (newValue, minimumValue) {
      return _Utilities.Utilities.getValue(minimumValue) < newValue;
    });
  }

  _inherits(MinimumValueValidationRule, _ValidationRule9);

  return MinimumValueValidationRule;
})(ValidationRule);

exports.MinimumValueValidationRule = MinimumValueValidationRule;

var MinimumInclusiveValueValidationRule = (function (_ValidationRule10) {
  function MinimumInclusiveValueValidationRule(minimumValue) {
    _classCallCheck(this, MinimumInclusiveValueValidationRule);

    _ValidationRule10.call(this, minimumValue, function (newValue, minimumValue) {
      return _Utilities.Utilities.getValue(minimumValue) <= newValue;
    });
  }

  _inherits(MinimumInclusiveValueValidationRule, _ValidationRule10);

  return MinimumInclusiveValueValidationRule;
})(ValidationRule);

exports.MinimumInclusiveValueValidationRule = MinimumInclusiveValueValidationRule;

var MaximumValueValidationRule = (function (_ValidationRule11) {
  function MaximumValueValidationRule(maximumValue) {
    _classCallCheck(this, MaximumValueValidationRule);

    _ValidationRule11.call(this, maximumValue, function (newValue, maximumValue) {
      return newValue < _Utilities.Utilities.getValue(maximumValue);
    });
  }

  _inherits(MaximumValueValidationRule, _ValidationRule11);

  return MaximumValueValidationRule;
})(ValidationRule);

exports.MaximumValueValidationRule = MaximumValueValidationRule;

var MaximumInclusiveValueValidationRule = (function (_ValidationRule12) {
  function MaximumInclusiveValueValidationRule(maximumValue) {
    _classCallCheck(this, MaximumInclusiveValueValidationRule);

    _ValidationRule12.call(this, maximumValue, function (newValue, maximumValue) {
      return newValue <= _Utilities.Utilities.getValue(maximumValue);
    });
  }

  _inherits(MaximumInclusiveValueValidationRule, _ValidationRule12);

  return MaximumInclusiveValueValidationRule;
})(ValidationRule);

exports.MaximumInclusiveValueValidationRule = MaximumInclusiveValueValidationRule;

var BetweenValueValidationRule = (function (_ValidationRule13) {
  function BetweenValueValidationRule(minimumValue, maximumValue) {
    _classCallCheck(this, BetweenValueValidationRule);

    _ValidationRule13.call(this, { minimumValue: minimumValue, maximumValue: maximumValue }, function (newValue, threshold) {
      return _Utilities.Utilities.getValue(threshold.minimumValue) <= newValue && newValue <= _Utilities.Utilities.getValue(threshold.maximumValue);
    });
  }

  _inherits(BetweenValueValidationRule, _ValidationRule13);

  return BetweenValueValidationRule;
})(ValidationRule);

exports.BetweenValueValidationRule = BetweenValueValidationRule;

var DigitValidationRule = (function (_ValidationRule14) {
  function DigitValidationRule() {
    var _this4 = this;

    _classCallCheck(this, DigitValidationRule);

    _ValidationRule14.call(this, null, function (newValue, threshold) {
      return _this4.digitRegex.test(newValue);
    });
    this.digitRegex = /^\d+$/;
  }

  _inherits(DigitValidationRule, _ValidationRule14);

  return DigitValidationRule;
})(ValidationRule);

exports.DigitValidationRule = DigitValidationRule;

var NoSpacesValidationRule = (function (_ValidationRule15) {
  function NoSpacesValidationRule() {
    var _this5 = this;

    _classCallCheck(this, NoSpacesValidationRule);

    _ValidationRule15.call(this, null, function (newValue, threshold) {
      return _this5.regex.test(newValue);
    });
    this.regex = /^\S*$/;
  }

  _inherits(NoSpacesValidationRule, _ValidationRule15);

  return NoSpacesValidationRule;
})(ValidationRule);

exports.NoSpacesValidationRule = NoSpacesValidationRule;

var AlphaNumericValidationRule = (function (_ValidationRule16) {
  function AlphaNumericValidationRule() {
    var _this6 = this;

    _classCallCheck(this, AlphaNumericValidationRule);

    _ValidationRule16.call(this, null, function (newValue, threshold) {
      return _this6.alphaNumericRegex.test(newValue);
    });
    this.alphaNumericRegex = /^[a-z0-9]+$/i;
  }

  _inherits(AlphaNumericValidationRule, _ValidationRule16);

  return AlphaNumericValidationRule;
})(ValidationRule);

exports.AlphaNumericValidationRule = AlphaNumericValidationRule;

var AlphaValidationRule = (function (_ValidationRule17) {
  function AlphaValidationRule() {
    var _this7 = this;

    _classCallCheck(this, AlphaValidationRule);

    _ValidationRule17.call(this, null, function (newValue, threshold) {
      return _this7.alphaRegex.test(newValue);
    });
    this.alphaRegex = /^[a-z]+$/i;
  }

  _inherits(AlphaValidationRule, _ValidationRule17);

  return AlphaValidationRule;
})(ValidationRule);

exports.AlphaValidationRule = AlphaValidationRule;

var AlphaOrWhitespaceValidationRule = (function (_ValidationRule18) {
  function AlphaOrWhitespaceValidationRule() {
    var _this8 = this;

    _classCallCheck(this, AlphaOrWhitespaceValidationRule);

    _ValidationRule18.call(this, null, function (newValue, threshold) {
      return _this8.alphaNumericRegex.test(newValue);
    });
    this.alphaNumericRegex = /^[a-z\s]+$/i;
  }

  _inherits(AlphaOrWhitespaceValidationRule, _ValidationRule18);

  return AlphaOrWhitespaceValidationRule;
})(ValidationRule);

exports.AlphaOrWhitespaceValidationRule = AlphaOrWhitespaceValidationRule;

var AlphaNumericOrWhitespaceValidationRule = (function (_ValidationRule19) {
  function AlphaNumericOrWhitespaceValidationRule() {
    var _this9 = this;

    _classCallCheck(this, AlphaNumericOrWhitespaceValidationRule);

    _ValidationRule19.call(this, null, function (newValue, threshold) {
      return _this9.alphaNumericRegex.test(newValue);
    });
    this.alphaNumericRegex = /^[a-z0-9\s]+$/i;
  }

  _inherits(AlphaNumericOrWhitespaceValidationRule, _ValidationRule19);

  return AlphaNumericOrWhitespaceValidationRule;
})(ValidationRule);

exports.AlphaNumericOrWhitespaceValidationRule = AlphaNumericOrWhitespaceValidationRule;

var MediumPasswordValidationRule = (function (_ValidationRule20) {
  function MediumPasswordValidationRule(minimumComplexityLevel) {
    _classCallCheck(this, MediumPasswordValidationRule);

    _ValidationRule20.call(this, minimumComplexityLevel ? minimumComplexityLevel : 3, function (newValue, threshold) {
      if (typeof newValue !== 'string') return false;
      var strength = 0;

      strength += /[A-Z]+/.test(newValue) ? 1 : 0;
      strength += /[a-z]+/.test(newValue) ? 1 : 0;
      strength += /[0-9]+/.test(newValue) ? 1 : 0;
      strength += /[\W]+/.test(newValue) ? 1 : 0;
      return strength >= threshold;
    });
  }

  _inherits(MediumPasswordValidationRule, _ValidationRule20);

  return MediumPasswordValidationRule;
})(ValidationRule);

exports.MediumPasswordValidationRule = MediumPasswordValidationRule;

var StrongPasswordValidationRule = (function (_MediumPasswordValidationRule) {
  function StrongPasswordValidationRule() {
    _classCallCheck(this, StrongPasswordValidationRule);

    _MediumPasswordValidationRule.call(this, 4);
  }

  _inherits(StrongPasswordValidationRule, _MediumPasswordValidationRule);

  return StrongPasswordValidationRule;
})(MediumPasswordValidationRule);

exports.StrongPasswordValidationRule = StrongPasswordValidationRule;

var EqualityValidationRuleBase = (function (_ValidationRule21) {
  function EqualityValidationRuleBase(otherValue, equality, otherValueLabel) {
    _classCallCheck(this, EqualityValidationRuleBase);

    _ValidationRule21.call(this, {
      otherValue: otherValue,
      equality: equality,
      otherValueLabel: otherValueLabel
    }, function (newValue, threshold) {
      var otherValue = _Utilities.Utilities.getValue(threshold.otherValue);
      if (newValue instanceof Date && otherValue instanceof Date) return threshold.equality === (newValue.getTime() === otherValue.getTime());
      return threshold.equality === (newValue === otherValue);
    });
  }

  _inherits(EqualityValidationRuleBase, _ValidationRule21);

  return EqualityValidationRuleBase;
})(ValidationRule);

exports.EqualityValidationRuleBase = EqualityValidationRuleBase;

var EqualityValidationRule = (function (_EqualityValidationRuleBase) {
  function EqualityValidationRule(otherValue) {
    _classCallCheck(this, EqualityValidationRule);

    _EqualityValidationRuleBase.call(this, otherValue, true);
  }

  _inherits(EqualityValidationRule, _EqualityValidationRuleBase);

  return EqualityValidationRule;
})(EqualityValidationRuleBase);

exports.EqualityValidationRule = EqualityValidationRule;

var EqualityWithOtherLabelValidationRule = (function (_EqualityValidationRuleBase2) {
  function EqualityWithOtherLabelValidationRule(otherValue, otherLabel) {
    _classCallCheck(this, EqualityWithOtherLabelValidationRule);

    _EqualityValidationRuleBase2.call(this, otherValue, true, otherLabel);
  }

  _inherits(EqualityWithOtherLabelValidationRule, _EqualityValidationRuleBase2);

  return EqualityWithOtherLabelValidationRule;
})(EqualityValidationRuleBase);

exports.EqualityWithOtherLabelValidationRule = EqualityWithOtherLabelValidationRule;

var InEqualityValidationRule = (function (_EqualityValidationRuleBase3) {
  function InEqualityValidationRule(otherValue) {
    _classCallCheck(this, InEqualityValidationRule);

    _EqualityValidationRuleBase3.call(this, otherValue, false);
  }

  _inherits(InEqualityValidationRule, _EqualityValidationRuleBase3);

  return InEqualityValidationRule;
})(EqualityValidationRuleBase);

exports.InEqualityValidationRule = InEqualityValidationRule;

var InEqualityWithOtherLabelValidationRule = (function (_EqualityValidationRuleBase4) {
  function InEqualityWithOtherLabelValidationRule(otherValue, otherLabel) {
    _classCallCheck(this, InEqualityWithOtherLabelValidationRule);

    _EqualityValidationRuleBase4.call(this, otherValue, false, otherLabel);
  }

  _inherits(InEqualityWithOtherLabelValidationRule, _EqualityValidationRuleBase4);

  return InEqualityWithOtherLabelValidationRule;
})(EqualityValidationRuleBase);

exports.InEqualityWithOtherLabelValidationRule = InEqualityWithOtherLabelValidationRule;

var InCollectionValidationRule = (function (_ValidationRule22) {
  function InCollectionValidationRule(collection) {
    _classCallCheck(this, InCollectionValidationRule);

    _ValidationRule22.call(this, collection, function (newValue, threshold) {
      var collection = _Utilities.Utilities.getValue(threshold);
      for (var i = 0; i < collection.length; i++) {
        if (newValue === collection[i]) return true;
      }
      return false;
    });
  }

  _inherits(InCollectionValidationRule, _ValidationRule22);

  return InCollectionValidationRule;
})(ValidationRule);

exports.InCollectionValidationRule = InCollectionValidationRule;