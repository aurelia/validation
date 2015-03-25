System.register(["../validation/validationGroupBuilder", "../validation/validationResult"], function (_export) {
  var ValidationGroupBuilder, ValidationResult, _createClass, _classCallCheck, ValidationGroup;

  return {
    setters: [function (_validationValidationGroupBuilder) {
      ValidationGroupBuilder = _validationValidationGroupBuilder.ValidationGroupBuilder;
    }, function (_validationValidationResult) {
      ValidationResult = _validationValidationResult.ValidationResult;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      ValidationGroup = _export("ValidationGroup", (function () {
        function ValidationGroup(subject, observerLocator) {
          _classCallCheck(this, ValidationGroup);

          this.result = new ValidationResult();
          this.subject = subject;
          this.validationProperties = [];
          this.builder = new ValidationGroupBuilder(observerLocator, this);
        }

        _createClass(ValidationGroup, {
          checkAll: {
            value: function checkAll() {
              for (var i = this.validationProperties.length - 1; i >= 0; i--) {
                var validatorProperty = this.validationProperties[i];
                validatorProperty.validateCurrentValue(true);
              }
              return this.result.isValid;
            }
          },
          ensure: {
            value: function ensure(propertyName) {
              return this.builder.ensure(propertyName);
            }
          },
          notEmpty: {
            value: function notEmpty() {
              return this.builder.notEmpty();
            }
          },
          minimum: {
            value: function minimum(minimumValue) {
              return this.builder.minimum(minimumValue);
            }
          },
          between: {
            value: function between(minimumValue, maximumValue) {
              return this.builder.between(minimumValue, maximumValue);
            }
          },
          maximum: {
            value: function maximum(maximumValue) {
              return this.builder.maximum(maximumValue);
            }
          },
          equals: {
            value: function equals(otherValue, otherValueLabel) {
              return this.builder.equals(otherValue, otherValueLabel);
            }
          },
          notEquals: {
            value: function notEquals(otherValue, otherValueLabel) {
              return this.builder.notEquals(otherValue, otherValueLabel);
            }
          },
          email: {
            value: function email() {
              return this.builder.email();
            }
          },
          "in": {
            value: function _in(collection) {
              return this.builder["in"](collection);
            }
          },
          minLength: {
            value: function minLength(minimumValue) {
              return this.builder.minLength(minimumValue);
            }
          },
          maxLength: {
            value: function maxLength(maximumValue) {
              return this.builder.maxLength(maximumValue);
            }
          },
          betweenLength: {
            value: function betweenLength(minimumValue, maximumValue) {
              return this.builder.betweenLength(minimumValue, maximumValue);
            }
          },
          isNumeric: {
            value: function isNumeric() {
              return this.builder.isNumeric();
            }
          },
          isDigit: {
            value: function isDigit() {
              return this.builder.isDigit();
            }
          },
          isAlphanumeric: {
            value: function isAlphanumeric() {
              return this.builder.isAlphaNumeric();
            }
          },
          isAlphanumericOrWhitespace: {
            value: function isAlphanumericOrWhitespace() {
              return this.builder.isAlphanumericOrWhitespace();
            }
          },
          isStrongPassword: {
            value: function isStrongPassword(minimumComplexityLevel) {
              return this.builder.isStrongPassword(minimumComplexityLevel);
            }
          },
          matchesRegex: {
            value: function matchesRegex(regexString) {
              return this.builder.matchesRegex(regexString);
            }
          },
          matches: {
            value: function matches(regex) {
              return this.builder.matches(regex);
            }
          },
          passes: {
            value: function passes(customFunction, threshold) {
              return this.builder.passes(customFunction, threshold);
            }
          },
          passesRule: {
            value: function passesRule(validationRule) {
              return this.builder.passesRule(validationRule);
            }
          },
          "if": {
            value: function _if(conditionExpression, threshold) {
              return this.builder["if"](conditionExpression, threshold);
            }
          },
          "else": {
            value: function _else() {
              return this.builder["else"]();
            }
          },
          endIf: {
            value: function endIf() {
              return this.builder.endIf();
            }
          },
          "switch": {
            value: function _switch(conditionExpression) {
              return this.builder["switch"](conditionExpression);
            }
          },
          "case": {
            value: function _case(caseLabel) {
              return this.builder["case"](caseLabel);
            }
          },
          "default": {
            value: function _default() {
              return this.builder["default"]();
            }
          },
          endSwitch: {
            value: function endSwitch() {
              return this.builder.endSwitch();
            }
          }
        });

        return ValidationGroup;
      })());
    }
  };
});