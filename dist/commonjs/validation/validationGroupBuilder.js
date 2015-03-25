"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var AllRules = _interopRequireWildcard(require("../validation/validationRules"));

var AllCollections = _interopRequireWildcard(require("../validation/validationRulesCollection"));

var ValidationProperty = require("../validation/validationProperty").ValidationProperty;

var ValidationGroupBuilder = exports.ValidationGroupBuilder = (function () {
  function ValidationGroupBuilder(observerLocator, validationGroup) {
    _classCallCheck(this, ValidationGroupBuilder);

    this.observerLocator = observerLocator;
    this.validationRuleCollections = []; //Flattened out queue of the nested collections
    this.validationGroup = validationGroup;
  }

  _createClass(ValidationGroupBuilder, {
    ensure: {
      value: function ensure(propertyName) {
        var newValidationProperty = null;
        this.validationRuleCollections = [];
        for (var i = 0; i < this.validationGroup.validationProperties; i++) {
          if (this.validationGroup.validationProperties[i].propertyName === propertyName) {
            newValidationProperty = this.validationGroup.validationProperties[i];
            break;
          }
        }
        if (newValidationProperty === null) {
          var propertyResult = this.validationGroup.result.addProperty(propertyName);
          newValidationProperty = new ValidationProperty(this.observerLocator, propertyName, this.validationGroup, propertyResult);
          this.validationGroup.validationProperties.push(newValidationProperty);
        }
        this.validationRuleCollections.unshift(newValidationProperty.validationRules);
        return this.validationGroup;
      }
    },
    notEmpty: {
      value: function notEmpty() {
        this.validationRuleCollections[0].notEmpty();
        this.validationGroup.validationProperties[this.validationGroup.validationProperties.length - 1].validateCurrentValue();
        return this.validationGroup;
      }
    },
    minimum: {
      value: function minimum(minimumValue) {
        return this.passesRule(new AllRules.MinimumValueValidationRule(minimumValue));
      }
    },
    between: {
      value: function between(minimumValue, maximumValue) {
        return this.passesRule(new AllRules.BetweenValueValidationRule(minimumValue, maximumValue));
      }
    },
    "in": {
      value: function _in(collection) {
        return this.passesRule(new AllRules.InCollectionValidationRule(collection));
      }
    },
    maximum: {
      value: function maximum(maximumValue) {
        return this.passesRule(new AllRules.MaximumValueValidationRule(maximumValue));
      }
    },
    equals: {
      value: function equals(otherValue, otherValueLabel) {
        return this.passesRule(new AllRules.EqualityValidationRule(otherValue, true, otherValueLabel));
      }
    },
    notEquals: {
      value: function notEquals(otherValue, otherValueLabel) {
        return this.passesRule(new AllRules.EqualityValidationRule(otherValue, false, otherValueLabel));
      }
    },
    email: {
      value: function email() {
        return this.passesRule(new AllRules.EmailValidationRule());
      }
    },
    minLength: {
      value: function minLength(minimumValue) {
        return this.passesRule(new AllRules.MinimumLengthValidationRule(minimumValue));
      }
    },
    maxLength: {
      value: function maxLength(maximumValue) {
        return this.passesRule(new AllRules.MaximumLengthValidationRule(maximumValue));
      }
    },
    betweenLength: {
      value: function betweenLength(minimumValue, maximumValue) {
        return this.passesRule(new AllRules.BetweenLengthValidationRule(minimumValue, maximumValue));
      }
    },
    isNumeric: {
      value: function isNumeric() {
        return this.passesRule(new AllRules.NumericValidationRule());
      }
    },
    isDigit: {
      value: function isDigit() {
        return this.passesRule(new AllRules.DigitValidationRule());
      }
    },
    isAlphanumeric: {
      value: function isAlphanumeric() {
        return this.passesRule(new AllRules.AlphaNumericValidationRule());
      }
    },
    isAlphanumericOrWhitespace: {
      value: function isAlphanumericOrWhitespace() {
        return this.passesRule(new AllRules.AlphaNumericOrWhitespaceValidationRule());
      }
    },
    isStrongPassword: {
      value: function isStrongPassword(minimumComplexityLevel) {
        return this.passesRule(new AllRules.StrongPasswordValidationRule(minimumComplexityLevel));
      }
    },
    matchesRegex: {
      value: function matchesRegex(regexString) {
        return this.matches(new RegExp(regexString));
      }
    },
    matches: {
      value: function matches(regex) {
        return this.passesRule(new AllRules.RegexValidationRule(regex));
      }
    },
    passes: {
      value: function passes(customFunction, threshold) {
        return this.passesRule(new AllRules.CustomFunctionValidationRule(customFunction, threshold));
      }
    },
    passesRule: {
      value: function passesRule(validationRule) {

        this.validationRuleCollections[0].addValidationRule(validationRule);
        return this.validationGroup;
      }
    },
    "if": {
      value: function _if(conditionExpression) {
        //IF is treated as a 'switch' with case 'true' and 'default'
        var conditionalCollection = new AllCollections.SwitchCaseValidationRulesCollection(conditionExpression);
        conditionalCollection["case"](true);
        this.validationRuleCollections[0].addValidationRuleCollection(conditionalCollection);
        this.validationRuleCollections.unshift(conditionalCollection);
        return this.validationGroup;
      }
    },
    "else": {
      value: function _else() {
        if (!this.validationRuleCollections[0]["default"]) throw "Invalid statement: 'else'";
        //this.validationRuleCollections[0].case(false);
        this.validationRuleCollections[0]["default"](); //slightly less object creation then 'case false'
        return this.validationGroup;
      }
    },
    endIf: {
      value: function endIf() {
        if (!this.validationRuleCollections[0]["default"]) throw "Invalid statement: 'endIf'";
        this.validationRuleCollections.shift(); //go up one level in the nested collections
        return this.validationGroup;
      }
    },
    "switch": {
      value: function _switch(conditionExpression) {
        var _this = this;

        var condition = conditionExpression;
        if (condition === undefined) {
          (function () {
            var observer = _this.validationGroup.validationProperties[_this.validationGroup.validationProperties.length - 1].observer;
            condition = function () {
              return observer.getValue();
            };
          })();
        }
        var conditionalCollection = new AllCollections.SwitchCaseValidationRulesCollection(condition);
        this.validationRuleCollections[0].addValidationRuleCollection(conditionalCollection);
        this.validationRuleCollections.unshift(conditionalCollection);
        return this.validationGroup;
      }
    },
    "case": {
      value: function _case(caseLabel) {
        if (!this.validationRuleCollections[0]["default"]) throw "Invalid statement: 'case'";
        this.validationRuleCollections[0]["case"](caseLabel);
        return this.validationGroup;
      }
    },
    "default": {
      value: function _default() {
        if (!this.validationRuleCollections[0]["default"]) throw "Invalid statement: 'case'";
        this.validationRuleCollections[0]["default"]();
        return this.validationGroup;
      }
    },
    endSwitch: {
      value: function endSwitch() {
        if (!this.validationRuleCollections[0]["default"]) throw "Invalid statement: 'endIf'";
        this.validationRuleCollections.shift(); //go up one level in the nested collections
        return this.validationGroup;
      }
    }
  });

  return ValidationGroupBuilder;
})();