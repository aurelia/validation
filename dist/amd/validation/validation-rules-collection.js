define(["exports", "../validation/validation"], function (exports, _validationValidation) {
  "use strict";

  var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Validation = _validationValidation.Validation;

  var ValidationRulesCollection = exports.ValidationRulesCollection = (function () {
    function ValidationRulesCollection() {
      _classCallCheck(this, ValidationRulesCollection);

      this.isRequired = false;
      this.validationRules = [];
      this.validationCollections = [];
    }

    _createClass(ValidationRulesCollection, {
      validate: {
        value: function validate(newValue) {
          var _this = this;

          var executeRules = true;

          //Is required?
          if (Validation.Utilities.isEmptyValue(newValue)) {
            if (this.isRequired) {
              return Promise.reject({
                isValid: false,
                message: Validation.Locale.translate("isRequired"),
                failingRule: "isRequired"
              });
            } else {
              executeRules = false;
            }
          }

          var checks = Promise.resolve({
            isValid: true,
            message: "",
            failingRule: null
          });
          //validate rules
          if (executeRules) {
            for (var i = 0; i < this.validationRules.length; i++) {
              (function (i) {
                var rule = _this.validationRules[i];
                checks = checks.then(function () {
                  return rule.validate(newValue).then(function () {}, function () {
                    return Promise.reject({
                      isValid: false,
                      message: rule.explain(),
                      failingRule: rule.ruleName
                    });
                  });
                }, function (e) {
                  return Promise.reject(e);
                });
              })(i);
            }
          }
          //validate collections
          for (var i = 0; i < this.validationCollections.length; i++) {
            (function (i) {
              var validationCollection = _this.validationCollections[i];
              checks = checks.then(function () {
                return validationCollection.validate(newValue).then(function () {}, function (e) {
                  return Promise.reject(e);
                });
              }, function (e) {
                return Promise.reject(e);
              });
            })(i);
          }
          return checks.then(function () {
            return Promise.resolve({
              isValid: true,
              message: "",
              failingRule: null
            });
          }, function (e) {
            return Promise.reject(e);
          });
        }
      },
      addValidationRule: {
        value: function addValidationRule(validationRule) {
          if (validationRule.validate === undefined) //Can ES6 check on base class??
            throw new exception("That's not a valid validationRule");
          this.validationRules.push(validationRule);
        }
      },
      addValidationRuleCollection: {
        value: function addValidationRuleCollection(validationRulesCollection) {
          this.validationCollections.push(validationRulesCollection);
        }
      },
      notEmpty: {
        value: function notEmpty() {
          this.isRequired = true;
        }
      },
      withMessage: {
        value: function withMessage(message) {
          this.validationRules[this.validationRules.length - 1].withMessage(message);
        }
      }
    });

    return ValidationRulesCollection;
  })();

  var SwitchCaseValidationRulesCollection = exports.SwitchCaseValidationRulesCollection = (function () {
    function SwitchCaseValidationRulesCollection(conditionExpression) {
      _classCallCheck(this, SwitchCaseValidationRulesCollection);

      this.conditionExpression = conditionExpression;
      this.innerCollections = [];
      this.defaultCollection = new ValidationRulesCollection();
      this.caseLabel = "";
      this.defaultCaseLabel = { description: "this is the case label for 'default'" };
    }

    _createClass(SwitchCaseValidationRulesCollection, {
      "case": {
        value: function _case(caseLabel) {
          this.caseLabel = caseLabel;
          this.getCurrentCollection(caseLabel, true); //force creation
        }
      },
      "default": {
        value: function _default() {
          this.caseLabel = this.defaultCaseLabel;
        }
      },
      getCurrentCollection: {
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
      },
      validate: {
        value: function validate(newValue) {
          var collection = this.getCurrentCollection(this.conditionExpression(newValue));
          if (collection !== null) {
            return collection.validate(newValue);
          } else {
            return this.defaultCollection.validate(newValue);
          }
        }
      },
      addValidationRule: {
        value: function addValidationRule(validationRule) {
          var currentCollection = this.getCurrentCollection(this.caseLabel, true);
          currentCollection.addValidationRule(validationRule);
        }
      },
      addValidationRuleCollection: {
        value: function addValidationRuleCollection(validationRulesCollection) {
          var currentCollection = this.getCurrentCollection(this.caseLabel, true);
          currentCollection.addValidationRuleCollection(validationRulesCollection);
        }
      },
      notEmpty: {
        value: function notEmpty() {
          var collection = this.getCurrentCollection(this.caseLabel);
          if (collection !== null) collection.notEmpty();else this.defaultCollection.notEmpty();
        }
      },
      withMessage: {
        value: function withMessage(message) {
          var collection = this.getCurrentCollection(this.caseLabel);
          if (collection !== null) collection.withMessage(message);else this.defaultCollection.withMessage(message);
        }
      }
    });

    return SwitchCaseValidationRulesCollection;
  })();
});