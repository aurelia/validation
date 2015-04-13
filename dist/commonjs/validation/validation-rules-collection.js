'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Utilities = require('../validation/utilities');

var _ValidationLocale = require('../validation/validation-locale');

var ValidationRulesCollection = (function () {
  function ValidationRulesCollection() {
    _classCallCheck(this, ValidationRulesCollection);

    this.isRequired = false;
    this.validationRules = [];
    this.validationCollections = [];
  }

  _createClass(ValidationRulesCollection, [{
    key: 'validate',
    value: function validate(newValue, locale) {
      var _this = this;

      if (locale === undefined) {
        locale = _ValidationLocale.ValidationLocale.Repository['default'];
      }
      newValue = _Utilities.Utilities.getValue(newValue);
      var executeRules = true;

      if (_Utilities.Utilities.isEmptyValue(newValue)) {
        if (this.isRequired) {
          return Promise.resolve({
            isValid: false,
            message: locale.translate('isRequired'),
            failingRule: 'isRequired',
            latestValue: newValue
          });
        } else {
          executeRules = false;
        }
      }

      var checks = Promise.resolve({
        isValid: true,
        message: '',
        failingRule: null,
        latestValue: newValue
      });

      if (executeRules) {
        var _loop = function (i) {
          var rule = _this.validationRules[i];
          checks = checks.then(function (previousRuleResult) {
            if (previousRuleResult.isValid === false) {
              return previousRuleResult;
            } else {
              return rule.validate(newValue, locale).then(function (thisRuleResult) {
                if (thisRuleResult === false) {
                  return {
                    isValid: false,
                    message: rule.explain(),
                    failingRule: rule.ruleName,
                    latestValue: newValue
                  };
                } else {
                  if (!previousRuleResult.isValid) {
                    throw Error('ValidationRulesCollection.validate caught an unexpected result while validating it\'s chain of rules.');
                  }
                  return previousRuleResult;
                }
              });
            }
          });
        };

        for (var i = 0; i < this.validationRules.length; i++) {
          _loop(i);
        }
      }

      var _loop2 = function (i) {
        var validationCollection = _this.validationCollections[i];
        checks = checks.then(function (previousValidationResult) {
          if (previousValidationResult.isValid) return validationCollection.validate(newValue, locale);else return previousValidationResult;
        });
      };

      for (var i = 0; i < this.validationCollections.length; i++) {
        _loop2(i);
      }

      return checks;
    }
  }, {
    key: 'addValidationRule',
    value: function addValidationRule(validationRule) {
      if (validationRule.validate === undefined) throw new exception('That\'s not a valid validationRule');
      this.validationRules.push(validationRule);
    }
  }, {
    key: 'addValidationRuleCollection',
    value: function addValidationRuleCollection(validationRulesCollection) {
      this.validationCollections.push(validationRulesCollection);
    }
  }, {
    key: 'isNotEmpty',
    value: function isNotEmpty() {
      this.isRequired = true;
    }
  }, {
    key: 'withMessage',
    value: function withMessage(message) {
      this.validationRules[this.validationRules.length - 1].withMessage(message);
    }
  }]);

  return ValidationRulesCollection;
})();

exports.ValidationRulesCollection = ValidationRulesCollection;

var SwitchCaseValidationRulesCollection = (function () {
  function SwitchCaseValidationRulesCollection(conditionExpression) {
    _classCallCheck(this, SwitchCaseValidationRulesCollection);

    this.conditionExpression = conditionExpression;
    this.innerCollections = [];
    this.defaultCollection = new ValidationRulesCollection();
    this.caseLabel = '';
    this.defaultCaseLabel = { description: 'this is the case label for \'default\'' };
  }

  _createClass(SwitchCaseValidationRulesCollection, [{
    key: 'case',
    value: function _case(caseLabel) {
      this.caseLabel = caseLabel;
      this.getCurrentCollection(caseLabel, true);
    }
  }, {
    key: 'default',
    value: function _default() {
      this.caseLabel = this.defaultCaseLabel;
    }
  }, {
    key: 'getCurrentCollection',
    value: function getCurrentCollection(caseLabel) {
      var createIfNotExists = arguments[1] === undefined ? false : arguments[1];

      if (caseLabel === this.defaultCaseLabel) {
        return this.defaultCollection;
      }var currentCollection = null;
      for (var i = 0; i < this.innerCollections.length; i++) {
        currentCollection = this.innerCollections[i];
        if (currentCollection.caseLabel === caseLabel) {
          return currentCollection.collection;
        }
      }
      if (createIfNotExists) {
        currentCollection = {
          caseLabel: caseLabel,
          collection: new ValidationRulesCollection()
        };
        this.innerCollections.push(currentCollection);
        return currentCollection.collection;
      }
      return null;
    }
  }, {
    key: 'validate',
    value: function validate(newValue, locale) {
      var collection = this.getCurrentCollection(this.conditionExpression(newValue));
      if (collection !== null) {
        return collection.validate(newValue, locale);
      } else {
        return this.defaultCollection.validate(newValue, locale);
      }
    }
  }, {
    key: 'addValidationRule',
    value: function addValidationRule(validationRule) {
      var currentCollection = this.getCurrentCollection(this.caseLabel, true);
      currentCollection.addValidationRule(validationRule);
    }
  }, {
    key: 'addValidationRuleCollection',
    value: function addValidationRuleCollection(validationRulesCollection) {
      var currentCollection = this.getCurrentCollection(this.caseLabel, true);
      currentCollection.addValidationRuleCollection(validationRulesCollection);
    }
  }, {
    key: 'isNotEmpty',
    value: function isNotEmpty() {
      var collection = this.getCurrentCollection(this.caseLabel);
      if (collection !== null) collection.isNotEmpty();else this.defaultCollection.isNotEmpty();
    }
  }, {
    key: 'withMessage',
    value: function withMessage(message) {
      var collection = this.getCurrentCollection(this.caseLabel);
      if (collection !== null) collection.withMessage(message);else this.defaultCollection.withMessage(message);
    }
  }]);

  return SwitchCaseValidationRulesCollection;
})();

exports.SwitchCaseValidationRulesCollection = SwitchCaseValidationRulesCollection;