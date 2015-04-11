'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ValidationGroupBuilder = require('../validation/validation-group-builder');

var _ValidationResult = require('../validation/validation-result');

var ValidationGroup = (function () {
  function ValidationGroup(subject, observerLocator) {
    _classCallCheck(this, ValidationGroup);

    this.result = new _ValidationResult.ValidationResult();
    this.subject = subject;
    this.validationProperties = [];
    this.builder = new _ValidationGroupBuilder.ValidationGroupBuilder(observerLocator, this);
  }

  _createClass(ValidationGroup, [{
    key: 'checkAll',
    value: function checkAll() {
      throw 'The synchronous "checkAll()" function is no longer supported. Use "validate()" which returns a promise that fulfils when valid, rejects when invalid';
    }
  }, {
    key: 'validate',
    value: function validate() {
      var _this = this;

      var promise = Promise.resolve(true);

      var _loop = function (i) {
        var validatorProperty = _this.validationProperties[i];
        promise = promise.then(function () {
          return validatorProperty.validateCurrentValue(true);
        });
      };

      for (var i = this.validationProperties.length - 1; i >= 0; i--) {
        _loop(i);
      }
      promise = promise['catch'](function () {
        console.log('Should never get here: a validation property should always resolve to true/false!');
        debugger;
        throw Error('Should never get here: a validation property should always resolve to true/false!');
      });

      return promise.then(function () {
        if (_this.result.isValid) {
          return Promise.resolve(_this.result);
        } else {
          return Promise.reject(_this.result);
        }
      });
    }
  }, {
    key: 'ensure',
    value: function ensure(bindingPatch) {
      return this.builder.ensure(bindingPatch);
    }
  }, {
    key: 'isNotEmpty',
    value: function isNotEmpty() {
      return this.builder.isNotEmpty();
    }
  }, {
    key: 'isGreaterThanOrEqualTo',
    value: function isGreaterThanOrEqualTo(minimumValue) {
      return this.builder.isGreaterThanOrEqualTo(minimumValue);
    }
  }, {
    key: 'isGreaterThan',
    value: function isGreaterThan(minimumValue) {
      return this.builder.isGreaterThan(minimumValue);
    }
  }, {
    key: 'isBetween',
    value: function isBetween(minimumValue, maximumValue) {
      return this.builder.isBetween(minimumValue, maximumValue);
    }
  }, {
    key: 'isLessThanOrEqualTo',
    value: function isLessThanOrEqualTo(maximumValue) {
      return this.builder.isLessThanOrEqualTo(maximumValue);
    }
  }, {
    key: 'isLessThan',
    value: function isLessThan(maximumValue) {
      return this.builder.isLessThan(maximumValue);
    }
  }, {
    key: 'isEqualTo',
    value: function isEqualTo(otherValue, otherValueLabel) {
      return this.builder.isEqualTo(otherValue, otherValueLabel);
    }
  }, {
    key: 'isNotEqualTo',
    value: function isNotEqualTo(otherValue, otherValueLabel) {
      return this.builder.isNotEqualTo(otherValue, otherValueLabel);
    }
  }, {
    key: 'isEmail',
    value: function isEmail() {
      return this.builder.isEmail();
    }
  }, {
    key: 'isIn',
    value: function isIn(collection) {
      return this.builder.isIn(collection);
    }
  }, {
    key: 'hasMinLength',
    value: function hasMinLength(minimumValue) {
      return this.builder.hasMinLength(minimumValue);
    }
  }, {
    key: 'hasMaxLength',
    value: function hasMaxLength(maximumValue) {
      return this.builder.hasMaxLength(maximumValue);
    }
  }, {
    key: 'hasLengthBetween',
    value: function hasLengthBetween(minimumValue, maximumValue) {
      return this.builder.hasLengthBetween(minimumValue, maximumValue);
    }
  }, {
    key: 'isNumber',
    value: function isNumber() {
      return this.builder.isNumber();
    }
  }, {
    key: 'containsOnlyDigits',
    value: function containsOnlyDigits() {
      return this.builder.containsOnlyDigits();
    }
  }, {
    key: 'containsOnly',
    value: function containsOnly(regex) {
      return this.builder.containsOnly(regex);
    }
  }, {
    key: 'containsOnlyAlpha',
    value: function containsOnlyAlpha() {
      return this.builder.containsOnlyAlpha();
    }
  }, {
    key: 'containsOnlyAlphaOrWhitespace',
    value: function containsOnlyAlphaOrWhitespace() {
      return this.builder.containsOnlyAlphaOrWhitespace();
    }
  }, {
    key: 'containsOnlyLetters',
    value: function containsOnlyLetters() {
      return this.builder.containsOnlyAlpha();
    }
  }, {
    key: 'containsOnlyLettersOrWhitespace',
    value: function containsOnlyLettersOrWhitespace() {
      return this.builder.containsOnlyAlphaOrWhitespace();
    }
  }, {
    key: 'containsOnlyAlphanumerics',
    value: function containsOnlyAlphanumerics() {
      return this.builder.containsOnlyAlphanumerics();
    }
  }, {
    key: 'containsOnlyAlphanumericsOrWhitespace',
    value: function containsOnlyAlphanumericsOrWhitespace() {
      return this.builder.containsOnlyAlphanumericsOrWhitespace();
    }
  }, {
    key: 'isStrongPassword',
    value: function isStrongPassword(minimumComplexityLevel) {
      return this.builder.isStrongPassword(minimumComplexityLevel);
    }
  }, {
    key: 'matches',
    value: function matches(regex) {
      return this.builder.matches(regex);
    }
  }, {
    key: 'passes',
    value: function passes(customFunction, threshold) {
      return this.builder.passes(customFunction, threshold);
    }
  }, {
    key: 'passesRule',
    value: function passesRule(validationRule) {
      return this.builder.passesRule(validationRule);
    }
  }, {
    key: 'if',
    value: function _if(conditionExpression, threshold) {
      return this.builder['if'](conditionExpression, threshold);
    }
  }, {
    key: 'else',
    value: function _else() {
      return this.builder['else']();
    }
  }, {
    key: 'endIf',
    value: function endIf() {
      return this.builder.endIf();
    }
  }, {
    key: 'switch',
    value: function _switch(conditionExpression) {
      return this.builder['switch'](conditionExpression);
    }
  }, {
    key: 'case',
    value: function _case(caseLabel) {
      return this.builder['case'](caseLabel);
    }
  }, {
    key: 'default',
    value: function _default() {
      return this.builder['default']();
    }
  }, {
    key: 'endSwitch',
    value: function endSwitch() {
      return this.builder.endSwitch();
    }
  }, {
    key: 'withMessage',
    value: function withMessage(message) {
      return this.builder.withMessage(message);
    }
  }]);

  return ValidationGroup;
})();

exports.ValidationGroup = ValidationGroup;