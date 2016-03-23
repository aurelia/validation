import { Utilities } from './utilities';
import { ValidationLocale } from './validation-locale';

export let ValidationRulesCollection = class ValidationRulesCollection {
  constructor(config) {
    this.isRequired = config ? config.getValue('allPropertiesAreMandatory') : false;
    this.validationRules = [];
    this.validationCollections = [];
    this.isRequiredMessage = null;
  }

  validate(newValue, locale) {
    let executeRules = true;
    let thisMessage;
    let checks;
    if (locale === undefined) {
      locale = ValidationLocale.Repository.default;
    }
    newValue = Utilities.getValue(newValue);
    if (this.isRequiredMessage) {
      thisMessage = typeof this.isRequiredMessage === 'function' ? this.isRequiredMessage(newValue) : this.isRequiredMessage;
    } else {
      thisMessage = locale.translate('isRequired');
    }
    if (Utilities.isEmptyValue(newValue)) {
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
      this.validationRules.forEach(rule => {
        checks = checks.then(previousRuleResult => {
          if (previousRuleResult.isValid === false) {
            return previousRuleResult;
          }
          return rule.validate(newValue, locale).then(thisRuleResult => {
            if (thisRuleResult === false) {
              return {
                isValid: false,
                message: rule.explain(),
                failingRule: rule.ruleName,
                latestValue: newValue
              };
            }
            if (!previousRuleResult.isValid) {
              throw Error("ValidationRulesCollection.validate caught an unexpected result while validating it's chain of rules.");
            }
            return previousRuleResult;
          });
        });
      });
    }
    this.validationCollections.forEach(validationCollection => {
      checks = checks.then(previousValidationResult => {
        if (previousValidationResult.isValid) {
          return validationCollection.validate(newValue, locale);
        }
        return previousValidationResult;
      });
    });
    return checks;
  }

  addValidationRule(validationRule) {
    if (validationRule.validate === undefined) {
      throw new Error("That's not a valid validationRule");
    }
    this.validationRules.push(validationRule);
  }

  addValidationRuleCollection(validationRulesCollection) {
    this.validationCollections.push(validationRulesCollection);
  }

  isNotEmpty() {
    this.isRequired = true;
  }

  canBeEmpty() {
    this.isRequired = false;
  }

  withMessage(message) {
    if (this.validationRules.length === 0) {
      this.isRequiredMessage = message;
    } else {
      this.validationRules[this.validationRules.length - 1].withMessage(message);
    }
  }
};

export let SwitchCaseValidationRulesCollection = class SwitchCaseValidationRulesCollection {
  constructor(conditionExpression, config) {
    this.conditionExpression = conditionExpression;
    this.config = config;
    this.innerCollections = [];
    this.defaultCollection = new ValidationRulesCollection(this.config);
    this.caseLabel = '';
    this.defaultCaseLabel = { description: 'this is the case label for \'default\'' };
  }

  case(caseLabel) {
    this.caseLabel = caseLabel;
    this.getCurrentCollection(caseLabel, true);
  }

  default() {
    this.caseLabel = this.defaultCaseLabel;
  }

  getCurrentCollection(caseLabel, createIfNotExists = false) {
    if (caseLabel === this.defaultCaseLabel) {
      return this.defaultCollection;
    }
    let currentCollection = null;
    for (let i = 0; i < this.innerCollections.length; i++) {
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
  }

  validate(newValue, locale) {
    let collection = this.getCurrentCollection(this.conditionExpression(newValue));
    if (collection !== null) {
      return collection.validate(newValue, locale);
    }
    return this.defaultCollection.validate(newValue, locale);
  }

  addValidationRule(validationRule) {
    let currentCollection = this.getCurrentCollection(this.caseLabel, true);
    currentCollection.addValidationRule(validationRule);
  }

  addValidationRuleCollection(validationRulesCollection) {
    let currentCollection = this.getCurrentCollection(this.caseLabel, true);
    currentCollection.addValidationRuleCollection(validationRulesCollection);
  }

  isNotEmpty() {
    let collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null) {
      collection.isNotEmpty();
    } else {
      this.defaultCollection.isNotEmpty();
    }
  }

  canBeEmpty() {
    let collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null) {
      collection.canBeEmpty();
    } else {
      this.defaultCollection.canBeEmpty();
    }
  }

  withMessage(message) {
    let collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null) {
      collection.withMessage(message);
    } else {
      this.defaultCollection.withMessage(message);
    }
  }
};