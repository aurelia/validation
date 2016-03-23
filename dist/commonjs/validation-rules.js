'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InCollectionValidationRule = exports.InEqualityWithOtherLabelValidationRule = exports.InEqualityValidationRule = exports.EqualityWithOtherLabelValidationRule = exports.EqualityValidationRule = exports.EqualityValidationRuleBase = exports.StrongPasswordValidationRule = exports.MediumPasswordValidationRule = exports.AlphaNumericOrWhitespaceValidationRule = exports.AlphaOrWhitespaceValidationRule = exports.AlphaValidationRule = exports.AlphaNumericValidationRule = exports.NoSpacesValidationRule = exports.DigitValidationRule = exports.BetweenValueValidationRule = exports.MaximumInclusiveValueValidationRule = exports.MaximumValueValidationRule = exports.MinimumInclusiveValueValidationRule = exports.MinimumValueValidationRule = exports.ContainsOnlyValidationRule = exports.RegexValidationRule = exports.NumericValidationRule = exports.CustomFunctionValidationRule = exports.BetweenLengthValidationRule = exports.MaximumLengthValidationRule = exports.MinimumLengthValidationRule = exports.EmailValidationRule = exports.URLValidationRule = exports.ValidationRule = undefined;

var _utilities = require('./utilities');

var _validationLocale = require('./validation-locale');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationRule = exports.ValidationRule = function () {
  function ValidationRule(threshold, onValidate, message, ruleName) {
    _classCallCheck(this, ValidationRule);

    this.onValidate = onValidate;
    this.threshold = threshold;
    this.message = message;
    this.errorMessage = null;
    this.ruleName = ruleName;
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
    }
    if (typeof result === 'string') {
      this.errorMessage = result;
    } else {
      if (this.message) {
        if (typeof this.message === 'function') {
          this.errorMessage = this.message(currentValue, this.threshold);
        } else if (typeof this.message === 'string') {
          this.errorMessage = this.message;
        } else {
          throw Error('Unable to handle the error message:' + this.message);
        }
      } else {
        this.errorMessage = locale.translate(this.ruleName, currentValue, this.threshold);
      }
    }
    return false;
  };

  ValidationRule.prototype.validate = function validate(currentValue, locale) {
    var _this = this;

    if (locale === undefined) {
      locale = _validationLocale.ValidationLocale.Repository.default;
    }
    currentValue = _utilities.Utilities.getValue(currentValue);
    var result = this.onValidate(currentValue, this.threshold, locale);
    var promise = Promise.resolve(result);

    var nextPromise = promise.then(function (promiseResult) {
      return _this.setResult(promiseResult, currentValue, locale);
    }, function (promiseFailure) {
      if (typeof promiseFailure === 'string' && promiseFailure !== '') {
        return _this.setResult(promiseFailure, currentValue, locale);
      }
      return _this.setResult(false, currentValue, locale);
    });
    return nextPromise;
  };

  return ValidationRule;
}();

var URLValidationRule = exports.URLValidationRule = function (_ValidationRule) {
  _inherits(URLValidationRule, _ValidationRule);

  URLValidationRule.isIP = function isIP(str, version) {
    var ipv4Maybe = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    var ipv6Block = /^[0-9A-F]{1,4}$/i;
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
      if (blocks.length > 8) {
        return false;
      }

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
          if (foundOmissionBlock) {
            return false;
          }
          foundOmissionBlock = true;
        } else if (!ipv6Block.test(blocks[i])) {
          return false;
        }
      }
      if (foundOmissionBlock) {
        return blocks.length >= 1;
      }
      return blocks.length === 8;
    }
    return false;
  };

  URLValidationRule.isFQDN = function isFQDN(str, options) {
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

  function URLValidationRule(startingThreshold) {
    _classCallCheck(this, URLValidationRule);

    var defaultUrlOptions = {
      protocols: ['http', 'https', 'ftp'],
      require_tld: true,
      require_protocol: false,
      allow_underscores: true,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: true
    };
    if (startingThreshold === undefined) {
      startingThreshold = defaultUrlOptions;
    }
    return _possibleConstructorReturn(this, _ValidationRule.call(this, startingThreshold, function (newValue, threshold) {
      var url = newValue;
      var protocol = void 0;
      var auth = void 0;
      var host = void 0;
      var hostname = void 0;
      var port = void 0;
      var portStr = void 0;
      var split = void 0;
      if (!url || url.length >= 2083 || /\s/.test(url)) {
        return false;
      }
      if (url.indexOf('mailto:') === 0) {
        return false;
      }
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
        portStr = split.join(':');
        port = parseInt(portStr, 10);
        if (!/^[0-9]+$/.test(portStr) || port <= 0 || port > 65535) {
          return false;
        }
      }
      if (!URLValidationRule.isIP(host) && !URLValidationRule.isFQDN(host, threshold) && host !== 'localhost') {
        return false;
      }
      if (threshold.host_whitelist && threshold.host_whitelist.indexOf(host) === -1) {
        return false;
      }
      if (threshold.host_blacklist && threshold.host_blacklist.indexOf(host) !== -1) {
        return false;
      }
      return true;
    }, null, 'URLValidationRule'));
  }

  return URLValidationRule;
}(ValidationRule);

var EmailValidationRule = exports.EmailValidationRule = function (_ValidationRule2) {
  _inherits(EmailValidationRule, _ValidationRule2);

  EmailValidationRule.testEmailUserUtf8Regex = function testEmailUserUtf8Regex(user) {
    var emailUserUtf8Regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i;
    return emailUserUtf8Regex.test(user);
  };

  EmailValidationRule.isFQDN = function isFQDN(str) {
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

  function EmailValidationRule() {
    _classCallCheck(this, EmailValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule2.call(this, null, function (newValue, threshold) {
      if (/\s/.test(newValue)) {
        return false;
      }
      var parts = newValue.split('@');
      var domain = parts.pop();
      var user = parts.join('@');

      if (!EmailValidationRule.isFQDN(domain)) {
        return false;
      }
      return EmailValidationRule.testEmailUserUtf8Regex(user);
    }, null, 'EmailValidationRule'));
  }

  return EmailValidationRule;
}(ValidationRule);

var MinimumLengthValidationRule = exports.MinimumLengthValidationRule = function (_ValidationRule3) {
  _inherits(MinimumLengthValidationRule, _ValidationRule3);

  function MinimumLengthValidationRule(minimumLength) {
    _classCallCheck(this, MinimumLengthValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule3.call(this, minimumLength, function (newValue, minLength) {
      newValue = typeof newValue === 'number' ? newValue.toString() : newValue;
      return newValue.length !== undefined && newValue.length >= minLength;
    }, null, 'MinimumLengthValidationRule'));
  }

  return MinimumLengthValidationRule;
}(ValidationRule);

var MaximumLengthValidationRule = exports.MaximumLengthValidationRule = function (_ValidationRule4) {
  _inherits(MaximumLengthValidationRule, _ValidationRule4);

  function MaximumLengthValidationRule(maximumLength) {
    _classCallCheck(this, MaximumLengthValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule4.call(this, maximumLength, function (newValue, maxLength) {
      newValue = typeof newValue === 'number' ? newValue.toString() : newValue;
      return newValue.length !== undefined && newValue.length <= maxLength;
    }, null, 'MaximumLengthValidationRule'));
  }

  return MaximumLengthValidationRule;
}(ValidationRule);

var BetweenLengthValidationRule = exports.BetweenLengthValidationRule = function (_ValidationRule5) {
  _inherits(BetweenLengthValidationRule, _ValidationRule5);

  function BetweenLengthValidationRule(minimumLength, maximumLength) {
    _classCallCheck(this, BetweenLengthValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule5.call(this, { minimumLength: minimumLength, maximumLength: maximumLength }, function (newValue, threshold) {
      newValue = typeof newValue === 'number' ? newValue.toString() : newValue;
      return newValue.length !== undefined && newValue.length >= threshold.minimumLength && newValue.length <= threshold.maximumLength;
    }, null, 'BetweenLengthValidationRule'));
  }

  return BetweenLengthValidationRule;
}(ValidationRule);

var CustomFunctionValidationRule = exports.CustomFunctionValidationRule = function (_ValidationRule6) {
  _inherits(CustomFunctionValidationRule, _ValidationRule6);

  function CustomFunctionValidationRule(customFunction, threshold) {
    _classCallCheck(this, CustomFunctionValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule6.call(this, threshold, customFunction, null, 'CustomFunctionValidationRule'));
  }

  return CustomFunctionValidationRule;
}(ValidationRule);

var NumericValidationRule = exports.NumericValidationRule = function (_ValidationRule7) {
  _inherits(NumericValidationRule, _ValidationRule7);

  function NumericValidationRule() {
    _classCallCheck(this, NumericValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule7.call(this, null, function (newValue, threshold, locale) {
      var numericRegex = locale.setting('numericRegex');
      var floatValue = parseFloat(newValue);
      return !Number.isNaN(parseFloat(newValue)) && Number.isFinite(floatValue) && numericRegex.test(newValue);
    }, null, 'NumericValidationRule'));
  }

  return NumericValidationRule;
}(ValidationRule);

var RegexValidationRule = exports.RegexValidationRule = function (_ValidationRule8) {
  _inherits(RegexValidationRule, _ValidationRule8);

  function RegexValidationRule(startingRegex, ruleName) {
    _classCallCheck(this, RegexValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule8.call(this, startingRegex, function (newValue, regex) {
      return regex.test(newValue);
    }, null, ruleName || 'RegexValidationRule'));
  }

  return RegexValidationRule;
}(ValidationRule);

var ContainsOnlyValidationRule = exports.ContainsOnlyValidationRule = function (_RegexValidationRule) {
  _inherits(ContainsOnlyValidationRule, _RegexValidationRule);

  function ContainsOnlyValidationRule(regex) {
    _classCallCheck(this, ContainsOnlyValidationRule);

    return _possibleConstructorReturn(this, _RegexValidationRule.call(this, regex, 'ContainsOnlyValidationRule'));
  }

  return ContainsOnlyValidationRule;
}(RegexValidationRule);

var MinimumValueValidationRule = exports.MinimumValueValidationRule = function (_ValidationRule9) {
  _inherits(MinimumValueValidationRule, _ValidationRule9);

  function MinimumValueValidationRule(minimumValue) {
    _classCallCheck(this, MinimumValueValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule9.call(this, minimumValue, function (newValue, minValue) {
      return _utilities.Utilities.getValue(minValue) < newValue;
    }, null, 'MinimumValueValidationRule'));
  }

  return MinimumValueValidationRule;
}(ValidationRule);

var MinimumInclusiveValueValidationRule = exports.MinimumInclusiveValueValidationRule = function (_ValidationRule10) {
  _inherits(MinimumInclusiveValueValidationRule, _ValidationRule10);

  function MinimumInclusiveValueValidationRule(minimumValue) {
    _classCallCheck(this, MinimumInclusiveValueValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule10.call(this, minimumValue, function (newValue, minValue) {
      return _utilities.Utilities.getValue(minValue) <= newValue;
    }, null, 'MinimumInclusiveValueValidationRule'));
  }

  return MinimumInclusiveValueValidationRule;
}(ValidationRule);

var MaximumValueValidationRule = exports.MaximumValueValidationRule = function (_ValidationRule11) {
  _inherits(MaximumValueValidationRule, _ValidationRule11);

  function MaximumValueValidationRule(maximumValue) {
    _classCallCheck(this, MaximumValueValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule11.call(this, maximumValue, function (newValue, maxValue) {
      return newValue < _utilities.Utilities.getValue(maxValue);
    }, null, 'MaximumValueValidationRule'));
  }

  return MaximumValueValidationRule;
}(ValidationRule);

var MaximumInclusiveValueValidationRule = exports.MaximumInclusiveValueValidationRule = function (_ValidationRule12) {
  _inherits(MaximumInclusiveValueValidationRule, _ValidationRule12);

  function MaximumInclusiveValueValidationRule(maximumValue) {
    _classCallCheck(this, MaximumInclusiveValueValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule12.call(this, maximumValue, function (newValue, maxValue) {
      return newValue <= _utilities.Utilities.getValue(maxValue);
    }, null, 'MaximumInclusiveValueValidationRule'));
  }

  return MaximumInclusiveValueValidationRule;
}(ValidationRule);

var BetweenValueValidationRule = exports.BetweenValueValidationRule = function (_ValidationRule13) {
  _inherits(BetweenValueValidationRule, _ValidationRule13);

  function BetweenValueValidationRule(minimumValue, maximumValue) {
    _classCallCheck(this, BetweenValueValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule13.call(this, { minimumValue: minimumValue, maximumValue: maximumValue }, function (newValue, threshold) {
      return _utilities.Utilities.getValue(threshold.minimumValue) <= newValue && newValue <= _utilities.Utilities.getValue(threshold.maximumValue);
    }, null, 'BetweenValueValidationRule'));
  }

  return BetweenValueValidationRule;
}(ValidationRule);

var DigitValidationRule = exports.DigitValidationRule = function (_ValidationRule14) {
  _inherits(DigitValidationRule, _ValidationRule14);

  function DigitValidationRule() {
    _classCallCheck(this, DigitValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule14.call(this, null, function (newValue, threshold) {
      return (/^\d+$/.test(newValue)
      );
    }, null, 'DigitValidationRule'));
  }

  return DigitValidationRule;
}(ValidationRule);

var NoSpacesValidationRule = exports.NoSpacesValidationRule = function (_ValidationRule15) {
  _inherits(NoSpacesValidationRule, _ValidationRule15);

  function NoSpacesValidationRule() {
    _classCallCheck(this, NoSpacesValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule15.call(this, null, function (newValue, threshold) {
      return (/^\S*$/.test(newValue)
      );
    }, null, 'NoSpacesValidationRule'));
  }

  return NoSpacesValidationRule;
}(ValidationRule);

var AlphaNumericValidationRule = exports.AlphaNumericValidationRule = function (_ValidationRule16) {
  _inherits(AlphaNumericValidationRule, _ValidationRule16);

  function AlphaNumericValidationRule() {
    _classCallCheck(this, AlphaNumericValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule16.call(this, null, function (newValue, threshold) {
      return (/^[a-z0-9]+$/i.test(newValue)
      );
    }, null, 'AlphaNumericValidationRule'));
  }

  return AlphaNumericValidationRule;
}(ValidationRule);

var AlphaValidationRule = exports.AlphaValidationRule = function (_ValidationRule17) {
  _inherits(AlphaValidationRule, _ValidationRule17);

  function AlphaValidationRule() {
    _classCallCheck(this, AlphaValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule17.call(this, null, function (newValue, threshold) {
      return (/^[a-z]+$/i.test(newValue)
      );
    }, null, 'AlphaValidationRule'));
  }

  return AlphaValidationRule;
}(ValidationRule);

var AlphaOrWhitespaceValidationRule = exports.AlphaOrWhitespaceValidationRule = function (_ValidationRule18) {
  _inherits(AlphaOrWhitespaceValidationRule, _ValidationRule18);

  function AlphaOrWhitespaceValidationRule() {
    _classCallCheck(this, AlphaOrWhitespaceValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule18.call(this, null, function (newValue, threshold) {
      return (/^[a-z\s]+$/i.test(newValue)
      );
    }, null, 'AlphaOrWhitespaceValidationRule'));
  }

  return AlphaOrWhitespaceValidationRule;
}(ValidationRule);

var AlphaNumericOrWhitespaceValidationRule = exports.AlphaNumericOrWhitespaceValidationRule = function (_ValidationRule19) {
  _inherits(AlphaNumericOrWhitespaceValidationRule, _ValidationRule19);

  function AlphaNumericOrWhitespaceValidationRule() {
    _classCallCheck(this, AlphaNumericOrWhitespaceValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule19.call(this, null, function (newValue, threshold) {
      return (/^[a-z0-9\s]+$/i.test(newValue)
      );
    }, null, 'AlphaNumericOrWhitespaceValidationRule'));
  }

  return AlphaNumericOrWhitespaceValidationRule;
}(ValidationRule);

var MediumPasswordValidationRule = exports.MediumPasswordValidationRule = function (_ValidationRule20) {
  _inherits(MediumPasswordValidationRule, _ValidationRule20);

  function MediumPasswordValidationRule(minimumComplexityLevel, ruleName) {
    _classCallCheck(this, MediumPasswordValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule20.call(this, minimumComplexityLevel ? minimumComplexityLevel : 3, function (newValue, threshold) {
      if (typeof newValue !== 'string') {
        return false;
      }
      var strength = 0;
      strength += /[A-Z]+/.test(newValue) ? 1 : 0;
      strength += /[a-z]+/.test(newValue) ? 1 : 0;
      strength += /[0-9]+/.test(newValue) ? 1 : 0;
      strength += /[\W]+/.test(newValue) ? 1 : 0;
      return strength >= threshold;
    }, null, ruleName || 'MediumPasswordValidationRule'));
  }

  return MediumPasswordValidationRule;
}(ValidationRule);

var StrongPasswordValidationRule = exports.StrongPasswordValidationRule = function (_MediumPasswordValida) {
  _inherits(StrongPasswordValidationRule, _MediumPasswordValida);

  function StrongPasswordValidationRule() {
    _classCallCheck(this, StrongPasswordValidationRule);

    return _possibleConstructorReturn(this, _MediumPasswordValida.call(this, 4, 'StrongPasswordValidationRule'));
  }

  return StrongPasswordValidationRule;
}(MediumPasswordValidationRule);

var EqualityValidationRuleBase = exports.EqualityValidationRuleBase = function (_ValidationRule21) {
  _inherits(EqualityValidationRuleBase, _ValidationRule21);

  function EqualityValidationRuleBase(startingOtherValue, equality, otherValueLabel, ruleName) {
    _classCallCheck(this, EqualityValidationRuleBase);

    return _possibleConstructorReturn(this, _ValidationRule21.call(this, {
      otherValue: startingOtherValue,
      equality: equality,
      otherValueLabel: otherValueLabel
    }, function (newValue, threshold) {
      var otherValue = _utilities.Utilities.getValue(threshold.otherValue);
      if (newValue instanceof Date && otherValue instanceof Date) {
        return threshold.equality === (newValue.getTime() === otherValue.getTime());
      }
      return threshold.equality === (newValue === otherValue);
    }, null, ruleName || 'EqualityValidationRuleBase'));
  }

  return EqualityValidationRuleBase;
}(ValidationRule);

var EqualityValidationRule = exports.EqualityValidationRule = function (_EqualityValidationRu) {
  _inherits(EqualityValidationRule, _EqualityValidationRu);

  function EqualityValidationRule(otherValue) {
    _classCallCheck(this, EqualityValidationRule);

    return _possibleConstructorReturn(this, _EqualityValidationRu.call(this, otherValue, true, null, 'EqualityValidationRule'));
  }

  return EqualityValidationRule;
}(EqualityValidationRuleBase);

var EqualityWithOtherLabelValidationRule = exports.EqualityWithOtherLabelValidationRule = function (_EqualityValidationRu2) {
  _inherits(EqualityWithOtherLabelValidationRule, _EqualityValidationRu2);

  function EqualityWithOtherLabelValidationRule(otherValue, otherLabel) {
    _classCallCheck(this, EqualityWithOtherLabelValidationRule);

    return _possibleConstructorReturn(this, _EqualityValidationRu2.call(this, otherValue, true, otherLabel, 'EqualityWithOtherLabelValidationRule'));
  }

  return EqualityWithOtherLabelValidationRule;
}(EqualityValidationRuleBase);

var InEqualityValidationRule = exports.InEqualityValidationRule = function (_EqualityValidationRu3) {
  _inherits(InEqualityValidationRule, _EqualityValidationRu3);

  function InEqualityValidationRule(otherValue) {
    _classCallCheck(this, InEqualityValidationRule);

    return _possibleConstructorReturn(this, _EqualityValidationRu3.call(this, otherValue, false, null, 'InEqualityValidationRule'));
  }

  return InEqualityValidationRule;
}(EqualityValidationRuleBase);

var InEqualityWithOtherLabelValidationRule = exports.InEqualityWithOtherLabelValidationRule = function (_EqualityValidationRu4) {
  _inherits(InEqualityWithOtherLabelValidationRule, _EqualityValidationRu4);

  function InEqualityWithOtherLabelValidationRule(otherValue, otherLabel) {
    _classCallCheck(this, InEqualityWithOtherLabelValidationRule);

    return _possibleConstructorReturn(this, _EqualityValidationRu4.call(this, otherValue, false, otherLabel, 'InEqualityWithOtherLabelValidationRule'));
  }

  return InEqualityWithOtherLabelValidationRule;
}(EqualityValidationRuleBase);

var InCollectionValidationRule = exports.InCollectionValidationRule = function (_ValidationRule22) {
  _inherits(InCollectionValidationRule, _ValidationRule22);

  function InCollectionValidationRule(startingCollection) {
    _classCallCheck(this, InCollectionValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule22.call(this, startingCollection, function (newValue, threshold) {
      var collection = _utilities.Utilities.getValue(threshold);
      for (var i = 0; i < collection.length; i++) {
        if (newValue === collection[i]) {
          return true;
        }
      }
      return false;
    }, null, 'InCollectionValidationRule'));
  }

  return InCollectionValidationRule;
}(ValidationRule);