'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('../validation/validation-rules');

var AllRules = _interopRequireWildcard(_import);

var _import2 = require('../validation/validation-rules-collection');

var AllCollections = _interopRequireWildcard(_import2);

var _ValidationProperty = require('../validation/validation-property');

var ValidationGroupBuilder = (function () {
  function ValidationGroupBuilder(observerLocator, validationGroup) {
    _classCallCheck(this, ValidationGroupBuilder);

    this.observerLocator = observerLocator;
    this.validationRuleCollections = [];
    this.validationGroup = validationGroup;
  }

  _createClass(ValidationGroupBuilder, [{
    key: 'ensure',
    value: function ensure(propertyName) {
      var newValidationProperty = null;
      this.validationRuleCollections = [];
      for (var i = 0; i < this.validationGroup.validationProperties.length; i++) {
        if (this.validationGroup.validationProperties[i].propertyName === propertyName) {
          newValidationProperty = this.validationGroup.validationProperties[i];
          break;
        }
      }
      if (newValidationProperty === null) {
        var propertyResult = this.validationGroup.result.addProperty(propertyName);
        newValidationProperty = new _ValidationProperty.ValidationProperty(this.observerLocator, propertyName, this.validationGroup, propertyResult);
        this.validationGroup.validationProperties.push(newValidationProperty);
      }
      this.validationRuleCollections.unshift(newValidationProperty.validationRules);
      return this.validationGroup;
    }
  }, {
    key: 'notEmpty',
    value: function notEmpty() {
      this.validationRuleCollections[0].notEmpty();
      this.checkLast();
      return this.validationGroup;
    }
  }, {
    key: 'minimum',
    value: function minimum(minimumValue) {
      return this.passesRule(new AllRules.MinimumValueValidationRule(minimumValue));
    }
  }, {
    key: 'between',
    value: function between(minimumValue, maximumValue) {
      return this.passesRule(new AllRules.BetweenValueValidationRule(minimumValue, maximumValue));
    }
  }, {
    key: 'in',
    value: function _in(collection) {
      return this.passesRule(new AllRules.InCollectionValidationRule(collection));
    }
  }, {
    key: 'maximum',
    value: function maximum(maximumValue) {
      return this.passesRule(new AllRules.MaximumValueValidationRule(maximumValue));
    }
  }, {
    key: 'equals',
    value: function equals(otherValue, otherValueLabel) {
      return this.passesRule(new AllRules.EqualityValidationRule(otherValue, true, otherValueLabel));
    }
  }, {
    key: 'notEquals',
    value: function notEquals(otherValue, otherValueLabel) {
      return this.passesRule(new AllRules.EqualityValidationRule(otherValue, false, otherValueLabel));
    }
  }, {
    key: 'email',
    value: function email() {
      return this.passesRule(new AllRules.EmailValidationRule());
    }
  }, {
    key: 'minLength',
    value: function minLength(minimumValue) {
      return this.passesRule(new AllRules.MinimumLengthValidationRule(minimumValue));
    }
  }, {
    key: 'maxLength',
    value: function maxLength(maximumValue) {
      return this.passesRule(new AllRules.MaximumLengthValidationRule(maximumValue));
    }
  }, {
    key: 'betweenLength',
    value: function betweenLength(minimumValue, maximumValue) {
      return this.passesRule(new AllRules.BetweenLengthValidationRule(minimumValue, maximumValue));
    }
  }, {
    key: 'isNumeric',
    value: function isNumeric() {
      return this.passesRule(new AllRules.NumericValidationRule());
    }
  }, {
    key: 'isDigit',
    value: function isDigit() {
      return this.passesRule(new AllRules.DigitValidationRule());
    }
  }, {
    key: 'isAlpha',
    value: function isAlpha() {
      return this.passesRule(new AllRules.AlphaValidationRule());
    }
  }, {
    key: 'isAlphaOrWhitespace',
    value: function isAlphaOrWhitespace() {
      return this.passesRule(new AllRules.AlphaOrWhitespaceValidationRule());
    }
  }, {
    key: 'isAlphanumeric',
    value: function isAlphanumeric() {
      return this.passesRule(new AllRules.AlphaNumericValidationRule());
    }
  }, {
    key: 'isAlphanumericOrWhitespace',
    value: function isAlphanumericOrWhitespace() {
      return this.passesRule(new AllRules.AlphaNumericOrWhitespaceValidationRule());
    }
  }, {
    key: 'isStrongPassword',
    value: function isStrongPassword(minimumComplexityLevel) {
      return this.passesRule(new AllRules.StrongPasswordValidationRule(minimumComplexityLevel));
    }
  }, {
    key: 'matchesRegex',
    value: function matchesRegex(regexString) {
      return this.matches(new RegExp(regexString));
    }
  }, {
    key: 'matches',
    value: function matches(regex) {
      return this.passesRule(new AllRules.RegexValidationRule(regex));
    }
  }, {
    key: 'passes',
    value: function passes(customFunction, threshold) {
      return this.passesRule(new AllRules.CustomFunctionValidationRule(customFunction, threshold));
    }
  }, {
    key: 'passesRule',
    value: function passesRule(validationRule) {

      this.validationRuleCollections[0].addValidationRule(validationRule);
      this.checkLast();
      return this.validationGroup;
    }
  }, {
    key: 'checkLast',
    value: function checkLast() {
      var validationProperty = this.validationGroup.validationProperties[this.validationGroup.validationProperties.length - 1];
      validationProperty.validateCurrentValue(false);
    }
  }, {
    key: 'withMessage',
    value: function withMessage(message) {
      this.validationRuleCollections[0].withMessage(message);
      this.checkLast();
      return this.validationGroup;
    }
  }, {
    key: 'if',
    value: function _if(conditionExpression) {
      var conditionalCollection = new AllCollections.SwitchCaseValidationRulesCollection(conditionExpression);
      conditionalCollection['case'](true);
      this.validationRuleCollections[0].addValidationRuleCollection(conditionalCollection);
      this.validationRuleCollections.unshift(conditionalCollection);
      return this.validationGroup;
    }
  }, {
    key: 'else',
    value: function _else() {
      if (!this.validationRuleCollections[0]['default']) throw 'Invalid statement: \'else\'';

      this.validationRuleCollections[0]['default']();
      return this.validationGroup;
    }
  }, {
    key: 'endIf',
    value: function endIf() {
      if (!this.validationRuleCollections[0]['default']) throw 'Invalid statement: \'endIf\'';
      this.validationRuleCollections.shift();
      this.checkLast();
      return this.validationGroup;
    }
  }, {
    key: 'switch',
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
  }, {
    key: 'case',
    value: function _case(caseLabel) {
      if (!this.validationRuleCollections[0]['default']) throw 'Invalid statement: \'case\'';
      this.validationRuleCollections[0]['case'](caseLabel);
      return this.validationGroup;
    }
  }, {
    key: 'default',
    value: function _default() {
      if (!this.validationRuleCollections[0]['default']) throw 'Invalid statement: \'case\'';
      this.validationRuleCollections[0]['default']();
      return this.validationGroup;
    }
  }, {
    key: 'endSwitch',
    value: function endSwitch() {
      if (!this.validationRuleCollections[0]['default']) throw 'Invalid statement: \'endIf\'';
      this.validationRuleCollections.shift();
      this.checkLast();
      return this.validationGroup;
    }
  }]);

  return ValidationGroupBuilder;
})();

exports.ValidationGroupBuilder = ValidationGroupBuilder;