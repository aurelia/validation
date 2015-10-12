'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilities = require('./utilities');

var _validationLocale = require('./validation-locale');

var ValidationRulesCollection = (function () {
  function ValidationRulesCollection(config) {
    _classCallCheck(this, ValidationRulesCollection);

    this.isRequired = config ? config.getValue('allPropertiesAreMandatory') : false;
    this.validationRules = [];
    this.validationCollections = [];
    this.isRequiredMessage = null;
  }

  ValidationRulesCollection.prototype.validate = function validate(newValue, locale) {
    var executeRules = true;
    var thisMessage = undefined;
    var checks = undefined;
    if (locale === undefined) {
      locale = _validationLocale.ValidationLocale.Repository['default'];
    }
    newValue = _utilities.Utilities.getValue(newValue);
    if (this.isRequiredMessage) {
      thisMessage = typeof this.isRequiredMessage === 'function' ? this.isRequiredMessage(newValue) : this.isRequiredMessage;
    } else {
      thisMessage = locale.translate('isRequired');
    }
    if (_utilities.Utilities.isEmptyValue(newValue)) {
      if (this.isRequired) {
        return Promise.resolve({
          isValid: false,
          message: thisMessage,
          failingRule: 'isRequired',
          latestValue: newValue
        });
      }
      executeRules = false;
    }
    checks = Promise.resolve({
      isValid: true,
      message: '',
      failingRule: null,
      latestValue: newValue
    });
    if (executeRules) {
      this.validationRules.forEach(function (rule) {
        checks = checks.then(function (previousRuleResult) {
          if (previousRuleResult.isValid === false) {
            return previousRuleResult;
          }
          return rule.validate(newValue, locale).then(function (thisRuleResult) {
            if (thisRuleResult === false) {
              return {
                isValid: false,
                message: rule.explain(),
                failingRule: rule.ruleName,
                latestValue: newValue
              };
            }
            if (!previousRuleResult.isValid) {
              throw Error('ValidationRulesCollection.validate caught an unexpected result while validating it\'s chain of rules.');
            }
            return previousRuleResult;
          });
        });
      });
    }
    this.validationCollections.forEach(function (validationCollection) {
      checks = checks.then(function (previousValidationResult) {
        if (previousValidationResult.isValid) {
          return validationCollection.validate(newValue, locale);
        }
        return previousValidationResult;
      });
    });
    return checks;
  };

  ValidationRulesCollection.prototype.addValidationRule = function addValidationRule(validationRule) {
    if (validationRule.validate === undefined) {
      throw new Error('That\'s not a valid validationRule');
    }
    this.validationRules.push(validationRule);
  };

  ValidationRulesCollection.prototype.addValidationRuleCollection = function addValidationRuleCollection(validationRulesCollection) {
    this.validationCollections.push(validationRulesCollection);
  };

  ValidationRulesCollection.prototype.isNotEmpty = function isNotEmpty() {
    this.isRequired = true;
  };

  ValidationRulesCollection.prototype.canBeEmpty = function canBeEmpty() {
    this.isRequired = false;
  };

  ValidationRulesCollection.prototype.withMessage = function withMessage(message) {
    if (this.validationRules.length === 0) {
      this.isRequiredMessage = message;
    } else {
      this.validationRules[this.validationRules.length - 1].withMessage(message);
    }
  };

  return ValidationRulesCollection;
})();

exports.ValidationRulesCollection = ValidationRulesCollection;

var SwitchCaseValidationRulesCollection = (function () {
  function SwitchCaseValidationRulesCollection(conditionExpression, config) {
    _classCallCheck(this, SwitchCaseValidationRulesCollection);

    this.conditionExpression = conditionExpression;
    this.config = config;
    this.innerCollections = [];
    this.defaultCollection = new ValidationRulesCollection(this.config);
    this.caseLabel = '';
    this.defaultCaseLabel = { description: 'this is the case label for \'default\'' };
  }

  SwitchCaseValidationRulesCollection.prototype['case'] = function _case(caseLabel) {
    this.caseLabel = caseLabel;
    this.getCurrentCollection(caseLabel, true);
  };

  SwitchCaseValidationRulesCollection.prototype['default'] = function _default() {
    this.caseLabel = this.defaultCaseLabel;
  };

  SwitchCaseValidationRulesCollection.prototype.getCurrentCollection = function getCurrentCollection(caseLabel) {
    var createIfNotExists = arguments[1] === undefined ? false : arguments[1];

    if (caseLabel === this.defaultCaseLabel) {
      return this.defaultCollection;
    }
    var currentCollection = null;
    for (var i = 0; i < this.innerCollections.length; i++) {
      currentCollection = this.innerCollections[i];
      if (currentCollection.caseLabel === caseLabel) {
        return currentCollection.collection;
      }
    }
    if (createIfNotExists) {
      currentCollection = {
        caseLabel: caseLabel,
        collection: new ValidationRulesCollection(this.config)
      };
      this.innerCollections.push(currentCollection);
      return currentCollection.collection;
    }
    return null;
  };

  SwitchCaseValidationRulesCollection.prototype.validate = function validate(newValue, locale) {
    var collection = this.getCurrentCollection(this.conditionExpression(newValue));
    if (collection !== null) {
      return collection.validate(newValue, locale);
    }
    return this.defaultCollection.validate(newValue, locale);
  };

  SwitchCaseValidationRulesCollection.prototype.addValidationRule = function addValidationRule(validationRule) {
    var currentCollection = this.getCurrentCollection(this.caseLabel, true);
    currentCollection.addValidationRule(validationRule);
  };

  SwitchCaseValidationRulesCollection.prototype.addValidationRuleCollection = function addValidationRuleCollection(validationRulesCollection) {
    var currentCollection = this.getCurrentCollection(this.caseLabel, true);
    currentCollection.addValidationRuleCollection(validationRulesCollection);
  };

  SwitchCaseValidationRulesCollection.prototype.isNotEmpty = function isNotEmpty() {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null) {
      collection.isNotEmpty();
    } else {
      this.defaultCollection.isNotEmpty();
    }
  };

  SwitchCaseValidationRulesCollection.prototype.canBeEmpty = function canBeEmpty() {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null) {
      collection.canBeEmpty();
    } else {
      this.defaultCollection.canBeEmpty();
    }
  };

  SwitchCaseValidationRulesCollection.prototype.withMessage = function withMessage(message) {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null) {
      collection.withMessage(message);
    } else {
      this.defaultCollection.withMessage(message);
    }
  };

  return SwitchCaseValidationRulesCollection;
})();

exports.SwitchCaseValidationRulesCollection = SwitchCaseValidationRulesCollection;