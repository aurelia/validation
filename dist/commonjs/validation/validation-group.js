'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ValidationGroupBuilder = require('../validation/validation-group-builder');

var _ValidationResult = require('../validation/validation-result');

var _ValidationLocale = require('../validation/validation-locale');

var ValidationGroup = (function () {
  function ValidationGroup(subject, observerLocator, config) {
    var _this = this;

    _classCallCheck(this, ValidationGroup);

    this.result = new _ValidationResult.ValidationResult();
    this.subject = subject;
    this.validationProperties = [];
    this.config = config;
    this.builder = new _ValidationGroupBuilder.ValidationGroupBuilder(observerLocator, this);
    this.onValidateCallbacks = [];
    this.onPropertyValidationCallbacks = [];
    this.isValidating = false;
    this.onDestroy = config.onLocaleChanged(function () {
      _this.validate(false, true);
    });

    if (this.subject.__proto__._validationMetadata) {
      this.subject.__proto__._validationMetadata.setup(this);
    }
  }

  _createClass(ValidationGroup, [{
    key: 'destroy',
    value: function destroy() {
      this.onDestroy();
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.validationProperties.forEach(function (prop) {
        prop.clear();
      });
      this.result.clear();
    }
  }, {
    key: 'onBreezeEntity',
    value: function onBreezeEntity() {
      var _this2 = this;

      var breezeEntity = this.subject;
      var me = this;
      this.onPropertyValidate(function (propertyBindingPath) {
        _this2.passes(function () {
          breezeEntity.entityAspect.validateProperty(propertyBindingPath);
          var errors = breezeEntity.entityAspect.getValidationErrors(propertyBindingPath);
          if (errors.length === 0) return true;else return errors[0].errorMessage;
        });
      });
      this.onValidate(function () {
        breezeEntity.entityAspect.validateEntity();
        return {};
      });

      breezeEntity.entityAspect.validationErrorsChanged.subscribe(function () {
        breezeEntity.entityAspect.getValidationErrors().forEach(function (validationError) {
          var propertyName = validationError.propertyName;
          if (!me.result.properties[propertyName]) {
            me.ensure(propertyName);
          }

          var currentResultProp = me.result.addProperty(propertyName);
          if (currentResultProp.isValid) {

            currentResultProp.setValidity({
              isValid: false,
              message: validationError.errorMessage,
              failingRule: 'breeze',
              latestValue: currentResultProp.latestValue
            }, true);
          }
        });
      });
    }
  }, {
    key: 'validate',
    value: function validate() {
      var _this3 = this;

      var forceDirty = arguments[0] === undefined ? true : arguments[0];
      var forceExecution = arguments[1] === undefined ? true : arguments[1];

      this.isValidating = true;
      var promise = Promise.resolve(true);

      var _loop = function (i) {
        var validatorProperty = _this3.validationProperties[i];
        promise = promise.then(function () {
          return validatorProperty.validateCurrentValue(forceDirty, forceExecution);
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

      this.onValidateCallbacks.forEach(function (onValidateCallback) {
        promise = promise.then(function () {
          return _this3.config.locale();
        }).then(function (locale) {
          return Promise.resolve(onValidateCallback.validationFunction()).then(function (callbackResult) {
            for (var prop in callbackResult) {
              if (!_this3.result.properties[prop]) {
                _this3.ensure(prop);
              }
              var resultProp = _this3.result.addProperty(prop);
              var result = callbackResult[prop];
              var newPropResult = {
                latestValue: resultProp.latestValue
              };
              if (result === true || result === null || result === '') {
                if (!resultProp.isValid && resultProp.failingRule === 'onValidateCallback') {
                  newPropResult.failingRule = null;
                  newPropResult.message = '';
                  newPropResult.isValid = true;
                  resultProp.setValidity(newPropResult, true);
                }
              } else {
                if (resultProp.isValid) {
                  newPropResult.failingRule = 'onValidateCallback';
                  newPropResult.isValid = false;
                  if (typeof result === 'string') {
                    newPropResult.message = result;
                  } else {
                    newPropResult.message = locale.translate(newPropResult.failingRule);
                  }
                  resultProp.setValidity(newPropResult, true);
                }
              }
            }
            _this3.result.checkValidity();
          }, function (a, b, c, d, e) {
            debugger;
            _this3.result.isValid = false;
            if (onValidateCallback.validationFunctionFailedCallback) {
              onValidateCallback.validationFunctionFailedCallback(a, b, c, d, e);
            }
          });
        });
      });
      promise = promise.then(function () {
        _this3.isValidating = false;
        if (_this3.result.isValid) {
          return Promise.resolve(_this3.result);
        } else {
          return Promise.reject(_this3.result);
        }
      });
      return promise;
    }
  }, {
    key: 'onValidate',
    value: function onValidate(validationFunction, validationFunctionFailedCallback) {
      this.onValidateCallbacks.push({ validationFunction: validationFunction, validationFunctionFailedCallback: validationFunctionFailedCallback });
      return this;
    }
  }, {
    key: 'onPropertyValidate',
    value: function onPropertyValidate(validationFunction) {
      this.onPropertyValidationCallbacks.push(validationFunction);
      return this;
    }
  }, {
    key: 'ensure',
    value: function ensure(bindingPath, configCallback) {
      this.builder.ensure(bindingPath, configCallback);
      this.onPropertyValidationCallbacks.forEach(function (callback) {
        callback(bindingPath);
      });
      return this;
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