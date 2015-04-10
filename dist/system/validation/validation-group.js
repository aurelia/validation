System.register(['../validation/validation-group-builder', '../validation/validation-result'], function (_export) {
  var ValidationGroupBuilder, ValidationResult, _classCallCheck, _createClass, ValidationGroup;

  return {
    setters: [function (_validationValidationGroupBuilder) {
      ValidationGroupBuilder = _validationValidationGroupBuilder.ValidationGroupBuilder;
    }, function (_validationValidationResult) {
      ValidationResult = _validationValidationResult.ValidationResult;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      ValidationGroup = (function () {
        function ValidationGroup(subject, observerLocator) {
          _classCallCheck(this, ValidationGroup);

          this.result = new ValidationResult();
          this.subject = subject;
          this.validationProperties = [];
          this.builder = new ValidationGroupBuilder(observerLocator, this);
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

            var promise = Promise.resolve(this.result);

            var _loop = function (i) {
              var validatorProperty = _this.validationProperties[i];
              promise = promise.then(function () {
                return validatorProperty.validateCurrentValue(true);
              }, function () {
                return validatorProperty.validateCurrentValue(true).then(function () {
                  return Promise.reject(false);
                }, function () {
                  return Promise.reject(false);
                });
              });
            };

            for (var i = this.validationProperties.length - 1; i >= 0; i--) {
              _loop(i);
            }
            return promise;
          }
        }, {
          key: 'ensure',
          value: function ensure(propertyPath) {
            return this.builder.ensure(propertyPath);
          }
        }, {
          key: 'notEmpty',
          value: function notEmpty() {
            return this.builder.notEmpty();
          }
        }, {
          key: 'minimum',
          value: function minimum(minimumValue) {
            return this.builder.minimum(minimumValue);
          }
        }, {
          key: 'between',
          value: function between(minimumValue, maximumValue) {
            return this.builder.between(minimumValue, maximumValue);
          }
        }, {
          key: 'maximum',
          value: function maximum(maximumValue) {
            return this.builder.maximum(maximumValue);
          }
        }, {
          key: 'equals',
          value: function equals(otherValue, otherValueLabel) {
            return this.builder.equals(otherValue, otherValueLabel);
          }
        }, {
          key: 'notEquals',
          value: function notEquals(otherValue, otherValueLabel) {
            return this.builder.notEquals(otherValue, otherValueLabel);
          }
        }, {
          key: 'email',
          value: function email() {
            return this.builder.email();
          }
        }, {
          key: 'in',
          value: function _in(collection) {
            return this.builder['in'](collection);
          }
        }, {
          key: 'minLength',
          value: function minLength(minimumValue) {
            return this.builder.minLength(minimumValue);
          }
        }, {
          key: 'maxLength',
          value: function maxLength(maximumValue) {
            return this.builder.maxLength(maximumValue);
          }
        }, {
          key: 'betweenLength',
          value: function betweenLength(minimumValue, maximumValue) {
            return this.builder.betweenLength(minimumValue, maximumValue);
          }
        }, {
          key: 'isNumeric',
          value: function isNumeric() {
            return this.builder.isNumeric();
          }
        }, {
          key: 'isDigit',
          value: function isDigit() {
            return this.builder.isDigit();
          }
        }, {
          key: 'isAlpha',
          value: function isAlpha() {
            return this.builder.isAlpha();
          }
        }, {
          key: 'isAlphanumeric',
          value: function isAlphanumeric() {
            return this.builder.isAlphanumeric();
          }
        }, {
          key: 'isAlphanumericOrWhitespace',
          value: function isAlphanumericOrWhitespace() {
            return this.builder.isAlphanumericOrWhitespace();
          }
        }, {
          key: 'isStrongPassword',
          value: function isStrongPassword(minimumComplexityLevel) {
            return this.builder.isStrongPassword(minimumComplexityLevel);
          }
        }, {
          key: 'matchesRegex',
          value: function matchesRegex(regexString) {
            return this.builder.matchesRegex(regexString);
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

      _export('ValidationGroup', ValidationGroup);
    }
  };
});