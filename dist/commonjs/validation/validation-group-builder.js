'use strict';

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === 'object' && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } };

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

var _ValidationConfig = require('../validation/validation-config');

var ValidationGroupBuilder = (function () {
  function ValidationGroupBuilder(observerLocator, validationGroup) {
    _classCallCheck(this, ValidationGroupBuilder);

    this.observerLocator = observerLocator;
    this.validationRuleCollections = [];
    this.validationGroup = validationGroup;
  }

  _createClass(ValidationGroupBuilder, [{
    key: 'ensure',
    value: function ensure(propertyName, configurationCallback) {
      var newValidationProperty = null;
      this.validationRuleCollections = [];

      for (var i = 0; i < this.validationGroup.validationProperties.length; i++) {
        if (this.validationGroup.validationProperties[i].propertyName === propertyName) {
          newValidationProperty = this.validationGroup.validationProperties[i];
          if (configurationCallback !== undefined && typeof configurationCallback === 'function') {
            throw Error('When creating validation rules on binding path ' + propertyName + ' a configuration callback function was provided, but validation rules have previously already been instantiated for this binding path');
          }
          break;
        }
      }
      if (newValidationProperty === null) {
        var propertyResult = this.validationGroup.result.addProperty(propertyName);
        var config = new _ValidationConfig.ValidationConfig(this.validationGroup.config);
        if (configurationCallback !== undefined && typeof configurationCallback === 'function') {
          configurationCallback(config);
        }
        newValidationProperty = new _ValidationProperty.ValidationProperty(this.observerLocator, propertyName, this.validationGroup, propertyResult, config);
        this.validationGroup.validationProperties.push(newValidationProperty);
      }
      this.validationRuleCollections.unshift(newValidationProperty.collectionOfValidationRules);
      return this.validationGroup;
    }
  }, {
    key: 'isNotEmpty',
    value: function isNotEmpty() {
      this.validationRuleCollections[0].isNotEmpty();
      this.checkLast();
      return this.validationGroup;
    }
  }, {
    key: 'isGreaterThan',
    value: function isGreaterThan(minimumValue) {
      return this.passesRule(new AllRules.MinimumValueValidationRule(minimumValue));
    }
  }, {
    key: 'isGreaterThanOrEqualTo',
    value: function isGreaterThanOrEqualTo(minimumValue) {
      return this.passesRule(new AllRules.MinimumInclusiveValueValidationRule(minimumValue));
    }
  }, {
    key: 'isBetween',
    value: function isBetween(minimumValue, maximumValue) {
      return this.passesRule(new AllRules.BetweenValueValidationRule(minimumValue, maximumValue));
    }
  }, {
    key: 'isIn',
    value: function isIn(collection) {
      return this.passesRule(new AllRules.InCollectionValidationRule(collection));
    }
  }, {
    key: 'isLessThan',
    value: function isLessThan(maximumValue) {
      return this.passesRule(new AllRules.MaximumValueValidationRule(maximumValue));
    }
  }, {
    key: 'isLessThanOrEqualTo',
    value: function isLessThanOrEqualTo(maximumValue) {
      return this.passesRule(new AllRules.MaximumInclusiveValueValidationRule(maximumValue));
    }
  }, {
    key: 'isEqualTo',
    value: function isEqualTo(otherValue, otherValueLabel) {
      if (!otherValueLabel) {
        return this.passesRule(new AllRules.EqualityValidationRule(otherValue));
      } else {
        return this.passesRule(new AllRules.EqualityWithOtherLabelValidationRule(otherValue, otherValueLabel));
      }
    }
  }, {
    key: 'isNotEqualTo',
    value: function isNotEqualTo(otherValue, otherValueLabel) {
      if (!otherValueLabel) {
        return this.passesRule(new AllRules.InEqualityValidationRule(otherValue));
      } else {
        return this.passesRule(new AllRules.InEqualityWithOtherLabelValidationRule(otherValue, otherValueLabel));
      }
    }
  }, {
    key: 'isEmail',
    value: function isEmail() {
      return this.passesRule(new AllRules.EmailValidationRule());
    }
  }, {
    key: 'hasMinLength',
    value: function hasMinLength(minimumValue) {
      return this.passesRule(new AllRules.MinimumLengthValidationRule(minimumValue));
    }
  }, {
    key: 'hasMaxLength',
    value: function hasMaxLength(maximumValue) {
      return this.passesRule(new AllRules.MaximumLengthValidationRule(maximumValue));
    }
  }, {
    key: 'hasLengthBetween',
    value: function hasLengthBetween(minimumValue, maximumValue) {
      return this.passesRule(new AllRules.BetweenLengthValidationRule(minimumValue, maximumValue));
    }
  }, {
    key: 'isNumber',
    value: function isNumber() {
      return this.passesRule(new AllRules.NumericValidationRule());
    }
  }, {
    key: 'containsOnlyDigits',
    value: function containsOnlyDigits() {
      return this.passesRule(new AllRules.DigitValidationRule());
    }
  }, {
    key: 'containsOnlyAlpha',
    value: function containsOnlyAlpha() {
      return this.passesRule(new AllRules.AlphaValidationRule());
    }
  }, {
    key: 'containsOnlyAlphaOrWhitespace',
    value: function containsOnlyAlphaOrWhitespace() {
      return this.passesRule(new AllRules.AlphaOrWhitespaceValidationRule());
    }
  }, {
    key: 'containsOnlyAlphanumerics',
    value: function containsOnlyAlphanumerics() {
      return this.passesRule(new AllRules.AlphaNumericValidationRule());
    }
  }, {
    key: 'containsOnlyAlphanumericsOrWhitespace',
    value: function containsOnlyAlphanumericsOrWhitespace() {
      return this.passesRule(new AllRules.AlphaNumericOrWhitespaceValidationRule());
    }
  }, {
    key: 'isStrongPassword',
    value: function isStrongPassword(minimumComplexityLevel) {
      if (minimumComplexityLevel === 4) {
        return this.passesRule(new AllRules.StrongPasswordValidationRule());
      } else {
        return this.passesRule(new AllRules.MediumPasswordValidationRule(minimumComplexityLevel));
      }
    }
  }, {
    key: 'containsOnly',
    value: function containsOnly(regex) {
      return this.passesRule(new AllRules.ContainsOnlyValidationRule(regex));
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