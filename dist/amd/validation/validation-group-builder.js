define(['exports', '../validation/validation-rules', '../validation/validation-rules-collection', '../validation/validation-property', '../validation/validation-config'], function (exports, _validationValidationRules, _validationValidationRulesCollection, _validationValidationProperty, _validationValidationConfig) {
  'use strict';

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

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
          var config = new _validationValidationConfig.ValidationConfig(this.validationGroup.config);
          if (configurationCallback !== undefined && typeof configurationCallback === 'function') {
            configurationCallback(config);
          }
          newValidationProperty = new _validationValidationProperty.ValidationProperty(this.observerLocator, propertyName, this.validationGroup, propertyResult, config);
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
        return this.passesRule(new _validationValidationRules.MinimumValueValidationRule(minimumValue));
      }
    }, {
      key: 'isGreaterThanOrEqualTo',
      value: function isGreaterThanOrEqualTo(minimumValue) {
        return this.passesRule(new _validationValidationRules.MinimumInclusiveValueValidationRule(minimumValue));
      }
    }, {
      key: 'isBetween',
      value: function isBetween(minimumValue, maximumValue) {
        return this.passesRule(new _validationValidationRules.BetweenValueValidationRule(minimumValue, maximumValue));
      }
    }, {
      key: 'isIn',
      value: function isIn(collection) {
        return this.passesRule(new _validationValidationRules.InCollectionValidationRule(collection));
      }
    }, {
      key: 'isLessThan',
      value: function isLessThan(maximumValue) {
        return this.passesRule(new _validationValidationRules.MaximumValueValidationRule(maximumValue));
      }
    }, {
      key: 'isLessThanOrEqualTo',
      value: function isLessThanOrEqualTo(maximumValue) {
        return this.passesRule(new _validationValidationRules.MaximumInclusiveValueValidationRule(maximumValue));
      }
    }, {
      key: 'isEqualTo',
      value: function isEqualTo(otherValue, otherValueLabel) {
        if (!otherValueLabel) {
          return this.passesRule(new _validationValidationRules.EqualityValidationRule(otherValue));
        } else {
          return this.passesRule(new _validationValidationRules.EqualityWithOtherLabelValidationRule(otherValue, otherValueLabel));
        }
      }
    }, {
      key: 'isNotEqualTo',
      value: function isNotEqualTo(otherValue, otherValueLabel) {
        if (!otherValueLabel) {
          return this.passesRule(new _validationValidationRules.InEqualityValidationRule(otherValue));
        } else {
          return this.passesRule(new _validationValidationRules.InEqualityWithOtherLabelValidationRule(otherValue, otherValueLabel));
        }
      }
    }, {
      key: 'isEmail',
      value: function isEmail() {
        return this.passesRule(new _validationValidationRules.EmailValidationRule());
      }
    }, {
      key: 'hasMinLength',
      value: function hasMinLength(minimumValue) {
        return this.passesRule(new _validationValidationRules.MinimumLengthValidationRule(minimumValue));
      }
    }, {
      key: 'hasMaxLength',
      value: function hasMaxLength(maximumValue) {
        return this.passesRule(new _validationValidationRules.MaximumLengthValidationRule(maximumValue));
      }
    }, {
      key: 'hasLengthBetween',
      value: function hasLengthBetween(minimumValue, maximumValue) {
        return this.passesRule(new _validationValidationRules.BetweenLengthValidationRule(minimumValue, maximumValue));
      }
    }, {
      key: 'isNumber',
      value: function isNumber() {
        return this.passesRule(new _validationValidationRules.NumericValidationRule());
      }
    }, {
      key: 'containsOnlyDigits',
      value: function containsOnlyDigits() {
        return this.passesRule(new _validationValidationRules.DigitValidationRule());
      }
    }, {
      key: 'containsOnlyAlpha',
      value: function containsOnlyAlpha() {
        return this.passesRule(new _validationValidationRules.AlphaValidationRule());
      }
    }, {
      key: 'containsOnlyAlphaOrWhitespace',
      value: function containsOnlyAlphaOrWhitespace() {
        return this.passesRule(new _validationValidationRules.AlphaOrWhitespaceValidationRule());
      }
    }, {
      key: 'containsOnlyAlphanumerics',
      value: function containsOnlyAlphanumerics() {
        return this.passesRule(new _validationValidationRules.AlphaNumericValidationRule());
      }
    }, {
      key: 'containsOnlyAlphanumericsOrWhitespace',
      value: function containsOnlyAlphanumericsOrWhitespace() {
        return this.passesRule(new _validationValidationRules.AlphaNumericOrWhitespaceValidationRule());
      }
    }, {
      key: 'isStrongPassword',
      value: function isStrongPassword(minimumComplexityLevel) {
        if (minimumComplexityLevel === 4) {
          return this.passesRule(new _validationValidationRules.StrongPasswordValidationRule());
        } else {
          return this.passesRule(new _validationValidationRules.MediumPasswordValidationRule(minimumComplexityLevel));
        }
      }
    }, {
      key: 'containsOnly',
      value: function containsOnly(regex) {
        return this.passesRule(new _validationValidationRules.ContainsOnlyValidationRule(regex));
      }
    }, {
      key: 'matches',
      value: function matches(regex) {
        return this.passesRule(new _validationValidationRules.RegexValidationRule(regex));
      }
    }, {
      key: 'passes',
      value: function passes(customFunction, threshold) {
        return this.passesRule(new _validationValidationRules.CustomFunctionValidationRule(customFunction, threshold));
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
        var conditionalCollection = new _validationValidationRulesCollection.SwitchCaseValidationRulesCollection(conditionExpression);
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
        var conditionalCollection = new _validationValidationRulesCollection.SwitchCaseValidationRulesCollection(condition);
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
});