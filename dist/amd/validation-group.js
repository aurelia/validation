define(['exports', 'aurelia-metadata', './validation-group-builder', './validation-result', './decorators'], function (exports, _aureliaMetadata, _validationGroupBuilder, _validationResult, _decorators) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var ValidationGroup = (function () {
    function ValidationGroup(subject, observerLocator, config) {
      var _this = this;

      _classCallCheck(this, ValidationGroup);

      var validationMetadata = undefined;
      this.result = new _validationResult.ValidationResult();
      this.subject = subject;
      this.validationProperties = [];
      this.config = config;
      this.builder = new _validationGroupBuilder.ValidationGroupBuilder(observerLocator, this);
      this.onValidateCallbacks = [];
      this.onPropertyValidationCallbacks = [];
      this.isValidating = false;
      this.onDestroy = config.onLocaleChanged(function () {
        _this.validate(false, true);
      });
      validationMetadata = _aureliaMetadata.metadata.getOwn(_decorators.ValidationMetadata.metadataKey, Object.getPrototypeOf(this.subject));
      if (validationMetadata) {
        validationMetadata.setup(this);
      }
    }

    ValidationGroup.prototype.destroy = function destroy() {
      this.validationProperties.forEach(function (prop) {
        prop.destroy();
      });
      this.onDestroy();
    };

    ValidationGroup.prototype.clear = function clear() {
      this.validationProperties.forEach(function (prop) {
        prop.clear();
      });
      this.result.clear();
    };

    ValidationGroup.prototype.onBreezeEntity = function onBreezeEntity() {
      var _this2 = this;

      var breezeEntity = this.subject;
      var me = this;
      var errors = undefined;
      this.onPropertyValidate(function (propertyBindingPath) {
        _this2.passes(function () {
          breezeEntity.entityAspect.validateProperty(propertyBindingPath);
          errors = breezeEntity.entityAspect.getValidationErrors(propertyBindingPath);
          if (errors.length === 0) {
            return true;
          }
          return errors[0].errorMessage;
        });
      });
      this.onValidate(function () {
        breezeEntity.entityAspect.validateEntity();
        return {};
      });
      breezeEntity.entityAspect.validationErrorsChanged.subscribe(function () {
        breezeEntity.entityAspect.getValidationErrors().forEach(function (validationError) {
          var propertyName = validationError.propertyName;
          var currentResultProp = undefined;
          if (!me.result.properties[propertyName]) {
            me.ensure(propertyName);
          }
          currentResultProp = me.result.addProperty(propertyName);
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
    };

    ValidationGroup.prototype.validate = function validate() {
      var _this3 = this;

      var forceDirty = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
      var forceExecution = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

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
        throw Error('Should never get here: a validation property should always resolve to true/false!');
      });
      this.onValidateCallbacks.forEach(function (onValidateCallback) {
        promise = promise.then(function () {
          return _this3.config.locale();
        }).then(function (locale) {
          return Promise.resolve(onValidateCallback.validationFunction()).then(function (callbackResult) {
            for (var prop in callbackResult) {
              var resultProp = undefined;
              var result = undefined;
              var newPropResult = undefined;
              if (!_this3.result.properties[prop]) {
                _this3.ensure(prop);
              }
              resultProp = _this3.result.addProperty(prop);
              result = callbackResult[prop];
              newPropResult = {
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
        }
        return Promise.reject(_this3.result);
      });
      return promise;
    };

    ValidationGroup.prototype.onValidate = function onValidate(validationFunction, validationFunctionFailedCallback) {
      this.onValidateCallbacks.push({ validationFunction: validationFunction, validationFunctionFailedCallback: validationFunctionFailedCallback });
      return this;
    };

    ValidationGroup.prototype.onPropertyValidate = function onPropertyValidate(validationFunction) {
      this.onPropertyValidationCallbacks.push(validationFunction);
      return this;
    };

    ValidationGroup.prototype.ensure = function ensure(bindingPath, configCallback) {
      this.builder.ensure(bindingPath, configCallback);
      this.onPropertyValidationCallbacks.forEach(function (callback) {
        callback(bindingPath);
      });
      return this;
    };

    ValidationGroup.prototype.isNotEmpty = function isNotEmpty() {
      return this.builder.isNotEmpty();
    };

    ValidationGroup.prototype.canBeEmpty = function canBeEmpty() {
      return this.builder.canBeEmpty();
    };

    ValidationGroup.prototype.isGreaterThanOrEqualTo = function isGreaterThanOrEqualTo(minimumValue) {
      return this.builder.isGreaterThanOrEqualTo(minimumValue);
    };

    ValidationGroup.prototype.isGreaterThan = function isGreaterThan(minimumValue) {
      return this.builder.isGreaterThan(minimumValue);
    };

    ValidationGroup.prototype.isBetween = function isBetween(minimumValue, maximumValue) {
      return this.builder.isBetween(minimumValue, maximumValue);
    };

    ValidationGroup.prototype.isLessThanOrEqualTo = function isLessThanOrEqualTo(maximumValue) {
      return this.builder.isLessThanOrEqualTo(maximumValue);
    };

    ValidationGroup.prototype.isLessThan = function isLessThan(maximumValue) {
      return this.builder.isLessThan(maximumValue);
    };

    ValidationGroup.prototype.isEqualTo = function isEqualTo(otherValue, otherValueLabel) {
      return this.builder.isEqualTo(otherValue, otherValueLabel);
    };

    ValidationGroup.prototype.isNotEqualTo = function isNotEqualTo(otherValue, otherValueLabel) {
      return this.builder.isNotEqualTo(otherValue, otherValueLabel);
    };

    ValidationGroup.prototype.isEmail = function isEmail() {
      return this.builder.isEmail();
    };

    ValidationGroup.prototype.isURL = function isURL() {
      return this.builder.isURL();
    };

    ValidationGroup.prototype.isIn = function isIn(collection) {
      return this.builder.isIn(collection);
    };

    ValidationGroup.prototype.hasMinLength = function hasMinLength(minimumValue) {
      return this.builder.hasMinLength(minimumValue);
    };

    ValidationGroup.prototype.hasMaxLength = function hasMaxLength(maximumValue) {
      return this.builder.hasMaxLength(maximumValue);
    };

    ValidationGroup.prototype.hasLengthBetween = function hasLengthBetween(minimumValue, maximumValue) {
      return this.builder.hasLengthBetween(minimumValue, maximumValue);
    };

    ValidationGroup.prototype.isNumber = function isNumber() {
      return this.builder.isNumber();
    };

    ValidationGroup.prototype.containsNoSpaces = function containsNoSpaces() {
      return this.builder.containsNoSpaces();
    };

    ValidationGroup.prototype.containsOnlyDigits = function containsOnlyDigits() {
      return this.builder.containsOnlyDigits();
    };

    ValidationGroup.prototype.containsOnly = function containsOnly(regex) {
      return this.builder.containsOnly(regex);
    };

    ValidationGroup.prototype.containsOnlyAlpha = function containsOnlyAlpha() {
      return this.builder.containsOnlyAlpha();
    };

    ValidationGroup.prototype.containsOnlyAlphaOrWhitespace = function containsOnlyAlphaOrWhitespace() {
      return this.builder.containsOnlyAlphaOrWhitespace();
    };

    ValidationGroup.prototype.containsOnlyLetters = function containsOnlyLetters() {
      return this.builder.containsOnlyAlpha();
    };

    ValidationGroup.prototype.containsOnlyLettersOrWhitespace = function containsOnlyLettersOrWhitespace() {
      return this.builder.containsOnlyAlphaOrWhitespace();
    };

    ValidationGroup.prototype.containsOnlyAlphanumerics = function containsOnlyAlphanumerics() {
      return this.builder.containsOnlyAlphanumerics();
    };

    ValidationGroup.prototype.containsOnlyAlphanumericsOrWhitespace = function containsOnlyAlphanumericsOrWhitespace() {
      return this.builder.containsOnlyAlphanumericsOrWhitespace();
    };

    ValidationGroup.prototype.isStrongPassword = function isStrongPassword(minimumComplexityLevel) {
      return this.builder.isStrongPassword(minimumComplexityLevel);
    };

    ValidationGroup.prototype.matches = function matches(regex) {
      return this.builder.matches(regex);
    };

    ValidationGroup.prototype.passes = function passes(customFunction, threshold) {
      return this.builder.passes(customFunction, threshold);
    };

    ValidationGroup.prototype.passesRule = function passesRule(validationRule) {
      return this.builder.passesRule(validationRule);
    };

    ValidationGroup.prototype['if'] = function _if(conditionExpression, threshold) {
      return this.builder['if'](conditionExpression, threshold);
    };

    ValidationGroup.prototype['else'] = function _else() {
      return this.builder['else']();
    };

    ValidationGroup.prototype.endIf = function endIf() {
      return this.builder.endIf();
    };

    ValidationGroup.prototype['switch'] = function _switch(conditionExpression) {
      return this.builder['switch'](conditionExpression);
    };

    ValidationGroup.prototype['case'] = function _case(caseLabel) {
      return this.builder['case'](caseLabel);
    };

    ValidationGroup.prototype['default'] = function _default() {
      return this.builder['default']();
    };

    ValidationGroup.prototype.endSwitch = function endSwitch() {
      return this.builder.endSwitch();
    };

    ValidationGroup.prototype.withMessage = function withMessage(message) {
      return this.builder.withMessage(message);
    };

    return ValidationGroup;
  })();

  exports.ValidationGroup = ValidationGroup;
});