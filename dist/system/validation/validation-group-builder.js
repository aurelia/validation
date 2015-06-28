System.register(['../validation/validation-rules', '../validation/validation-rules-collection', '../validation/validation-property', '../validation/validation-config'], function (_export) {
  'use strict';

  var AllRules, AllCollections, ValidationProperty, ValidationConfig, ValidationGroupBuilder;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_validationValidationRules) {
      AllRules = _validationValidationRules;
    }, function (_validationValidationRulesCollection) {
      AllCollections = _validationValidationRulesCollection;
    }, function (_validationValidationProperty) {
      ValidationProperty = _validationValidationProperty.ValidationProperty;
    }, function (_validationValidationConfig) {
      ValidationConfig = _validationValidationConfig.ValidationConfig;
    }],
    execute: function () {
      ValidationGroupBuilder = (function () {
        function ValidationGroupBuilder(observerLocator, validationGroup) {
          _classCallCheck(this, ValidationGroupBuilder);

          this.observerLocator = observerLocator;
          this.validationRuleCollections = [];
          this.validationGroup = validationGroup;
        }

        ValidationGroupBuilder.prototype.ensure = function ensure(propertyName, configurationCallback) {
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
            var config = new ValidationConfig(this.validationGroup.config);
            if (configurationCallback !== undefined && typeof configurationCallback === 'function') {
              configurationCallback(config);
            }
            newValidationProperty = new ValidationProperty(this.observerLocator, propertyName, this.validationGroup, propertyResult, config);
            this.validationGroup.validationProperties.push(newValidationProperty);
          }
          this.validationRuleCollections.unshift(newValidationProperty.collectionOfValidationRules);
          return this.validationGroup;
        };

        ValidationGroupBuilder.prototype.isNotEmpty = function isNotEmpty() {
          this.validationRuleCollections[0].isNotEmpty();
          this.checkLast();
          return this.validationGroup;
        };

        ValidationGroupBuilder.prototype.isGreaterThan = function isGreaterThan(minimumValue) {
          return this.passesRule(new AllRules.MinimumValueValidationRule(minimumValue));
        };

        ValidationGroupBuilder.prototype.isGreaterThanOrEqualTo = function isGreaterThanOrEqualTo(minimumValue) {
          return this.passesRule(new AllRules.MinimumInclusiveValueValidationRule(minimumValue));
        };

        ValidationGroupBuilder.prototype.isBetween = function isBetween(minimumValue, maximumValue) {
          return this.passesRule(new AllRules.BetweenValueValidationRule(minimumValue, maximumValue));
        };

        ValidationGroupBuilder.prototype.isIn = function isIn(collection) {
          return this.passesRule(new AllRules.InCollectionValidationRule(collection));
        };

        ValidationGroupBuilder.prototype.isLessThan = function isLessThan(maximumValue) {
          return this.passesRule(new AllRules.MaximumValueValidationRule(maximumValue));
        };

        ValidationGroupBuilder.prototype.isLessThanOrEqualTo = function isLessThanOrEqualTo(maximumValue) {
          return this.passesRule(new AllRules.MaximumInclusiveValueValidationRule(maximumValue));
        };

        ValidationGroupBuilder.prototype.isEqualTo = function isEqualTo(otherValue, otherValueLabel) {
          if (!otherValueLabel) return this.passesRule(new AllRules.EqualityValidationRule(otherValue));else return this.passesRule(new AllRules.EqualityWithOtherLabelValidationRule(otherValue, otherValueLabel));
        };

        ValidationGroupBuilder.prototype.isNotEqualTo = function isNotEqualTo(otherValue, otherValueLabel) {
          if (!otherValueLabel) return this.passesRule(new AllRules.InEqualityValidationRule(otherValue));else return this.passesRule(new AllRules.InEqualityWithOtherLabelValidationRule(otherValue, otherValueLabel));
        };

        ValidationGroupBuilder.prototype.isEmail = function isEmail() {
          return this.passesRule(new AllRules.EmailValidationRule());
        };

        ValidationGroupBuilder.prototype.isURL = function isURL() {
          return this.passesRule(new AllRules.URLValidationRule());
        };

        ValidationGroupBuilder.prototype.hasMinLength = function hasMinLength(minimumValue) {
          return this.passesRule(new AllRules.MinimumLengthValidationRule(minimumValue));
        };

        ValidationGroupBuilder.prototype.hasMaxLength = function hasMaxLength(maximumValue) {
          return this.passesRule(new AllRules.MaximumLengthValidationRule(maximumValue));
        };

        ValidationGroupBuilder.prototype.hasLengthBetween = function hasLengthBetween(minimumValue, maximumValue) {
          return this.passesRule(new AllRules.BetweenLengthValidationRule(minimumValue, maximumValue));
        };

        ValidationGroupBuilder.prototype.isNumber = function isNumber() {
          return this.passesRule(new AllRules.NumericValidationRule());
        };

        ValidationGroupBuilder.prototype.containsNoSpaces = function containsNoSpaces() {
          return this.passesRule(new AllRules.NoSpacesValidationRule());
        };

        ValidationGroupBuilder.prototype.containsOnlyDigits = function containsOnlyDigits() {
          return this.passesRule(new AllRules.DigitValidationRule());
        };

        ValidationGroupBuilder.prototype.containsOnlyAlpha = function containsOnlyAlpha() {
          return this.passesRule(new AllRules.AlphaValidationRule());
        };

        ValidationGroupBuilder.prototype.containsOnlyAlphaOrWhitespace = function containsOnlyAlphaOrWhitespace() {
          return this.passesRule(new AllRules.AlphaOrWhitespaceValidationRule());
        };

        ValidationGroupBuilder.prototype.containsOnlyAlphanumerics = function containsOnlyAlphanumerics() {
          return this.passesRule(new AllRules.AlphaNumericValidationRule());
        };

        ValidationGroupBuilder.prototype.containsOnlyAlphanumericsOrWhitespace = function containsOnlyAlphanumericsOrWhitespace() {
          return this.passesRule(new AllRules.AlphaNumericOrWhitespaceValidationRule());
        };

        ValidationGroupBuilder.prototype.isStrongPassword = function isStrongPassword(minimumComplexityLevel) {
          if (minimumComplexityLevel === 4) return this.passesRule(new AllRules.StrongPasswordValidationRule());else return this.passesRule(new AllRules.MediumPasswordValidationRule(minimumComplexityLevel));
        };

        ValidationGroupBuilder.prototype.containsOnly = function containsOnly(regex) {
          return this.passesRule(new AllRules.ContainsOnlyValidationRule(regex));
        };

        ValidationGroupBuilder.prototype.matches = function matches(regex) {
          return this.passesRule(new AllRules.RegexValidationRule(regex));
        };

        ValidationGroupBuilder.prototype.passes = function passes(customFunction, threshold) {
          return this.passesRule(new AllRules.CustomFunctionValidationRule(customFunction, threshold));
        };

        ValidationGroupBuilder.prototype.passesRule = function passesRule(validationRule) {

          this.validationRuleCollections[0].addValidationRule(validationRule);
          this.checkLast();
          return this.validationGroup;
        };

        ValidationGroupBuilder.prototype.checkLast = function checkLast() {
          var validationProperty = this.validationGroup.validationProperties[this.validationGroup.validationProperties.length - 1];
          validationProperty.validateCurrentValue(false);
        };

        ValidationGroupBuilder.prototype.withMessage = function withMessage(message) {
          this.validationRuleCollections[0].withMessage(message);
          this.checkLast();
          return this.validationGroup;
        };

        ValidationGroupBuilder.prototype['if'] = function _if(conditionExpression) {
          var conditionalCollection = new AllCollections.SwitchCaseValidationRulesCollection(conditionExpression);
          conditionalCollection['case'](true);
          this.validationRuleCollections[0].addValidationRuleCollection(conditionalCollection);
          this.validationRuleCollections.unshift(conditionalCollection);
          return this.validationGroup;
        };

        ValidationGroupBuilder.prototype['else'] = function _else() {
          if (!this.validationRuleCollections[0]['default']) throw 'Invalid statement: \'else\'';

          this.validationRuleCollections[0]['default']();
          return this.validationGroup;
        };

        ValidationGroupBuilder.prototype.endIf = function endIf() {
          if (!this.validationRuleCollections[0]['default']) throw 'Invalid statement: \'endIf\'';
          this.validationRuleCollections.shift();
          this.checkLast();
          return this.validationGroup;
        };

        ValidationGroupBuilder.prototype['switch'] = function _switch(conditionExpression) {
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
        };

        ValidationGroupBuilder.prototype['case'] = function _case(caseLabel) {
          if (!this.validationRuleCollections[0]['default']) throw 'Invalid statement: \'case\'';
          this.validationRuleCollections[0]['case'](caseLabel);
          return this.validationGroup;
        };

        ValidationGroupBuilder.prototype['default'] = function _default() {
          if (!this.validationRuleCollections[0]['default']) throw 'Invalid statement: \'case\'';
          this.validationRuleCollections[0]['default']();
          return this.validationGroup;
        };

        ValidationGroupBuilder.prototype.endSwitch = function endSwitch() {
          if (!this.validationRuleCollections[0]['default']) throw 'Invalid statement: \'endIf\'';
          this.validationRuleCollections.shift();
          this.checkLast();
          return this.validationGroup;
        };

        return ValidationGroupBuilder;
      })();

      _export('ValidationGroupBuilder', ValidationGroupBuilder);
    }
  };
});