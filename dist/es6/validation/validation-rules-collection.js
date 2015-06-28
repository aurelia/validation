import {Utilities} from '../validation/utilities';
import {ValidationLocale} from '../validation/validation-locale';

export class ValidationRulesCollection {
  constructor(config) {
    this.isRequired = config.getValue('treatAllPropertiesAsMandatory');
    this.validationRules = [];
    this.validationCollections = [];
    this.isRequiredMessage = null;
  }

  /**
   * Returns a promise that fulfils and resolves to simple result status object.
   */
  validate(newValue, locale) {
    if(locale === undefined)
    {
      locale = ValidationLocale.Repository.default;
    }
    newValue = Utilities.getValue(newValue);
    let executeRules = true;

    //Is required?
    if (Utilities.isEmptyValue(newValue)) {
      if (this.isRequired) {
        return Promise.resolve({
          isValid: false,
          message: this.isRequiredMessage ?
            ( (typeof(this.isRequiredMessage) === 'function') ? this.isRequiredMessage(newValue) : this.isRequiredMessage  ) :
            locale.translate('isRequired'),
          failingRule: 'isRequired',
          latestValue: newValue
        });
      }
      else {
        executeRules = false;
      }
    }

    var checks = Promise.resolve({
      isValid: true,
      message: '',
      failingRule: null,
      latestValue: newValue
    });

    //validate rules
    if (executeRules) {
      for (let i = 0; i < this.validationRules.length; i++) {
        let rule = this.validationRules[i];
        checks = checks.then( (previousRuleResult) => {
          //Earlier in the chain, something resolved to an invalid result. Chain it.
          if(previousRuleResult.isValid  === false)
          {
            return previousRuleResult;
          }
          else
          {
            return rule.validate(newValue, locale).then( (thisRuleResult) => {
              if(thisRuleResult === false) {
                return {
                  isValid: false,
                  message: rule.explain(),
                  failingRule: rule.ruleName,
                  latestValue: newValue
                };
              }
              else
              {
                //assertion
                if(!previousRuleResult.isValid)
                {
                  throw Error("ValidationRulesCollection.validate caught an unexpected result while validating it's chain of rules.");
                }
                return previousRuleResult;
              }
            });
          }
        });
      }
    }

    //validate collections
    for (let i = 0; i < this.validationCollections.length; i++) {
      let validationCollection = this.validationCollections[i];
      checks = checks.then( (previousValidationResult)=> {
        if(previousValidationResult.isValid)
          return validationCollection.validate(newValue, locale);
        else
          return previousValidationResult;
      });
    }

    return checks;
  }

  addValidationRule(validationRule) {
    if (validationRule.validate === undefined) //Can ES6 check on base class??
      throw new Error("That's not a valid validationRule");
    this.validationRules.push(validationRule);
  }

  addValidationRuleCollection(validationRulesCollection) {
    this.validationCollections.push(validationRulesCollection);
  }

  isNotEmpty() {
    this.isRequired = true;
  }

  canBeEmpty(){
    this.isRequired = false;
  }

  withMessage(message) {
    if(this.validationRules.length === 0)
      this.isRequiredMessage = message;
    else
      this.validationRules[this.validationRules.length - 1].withMessage(message);
  }
}

export class SwitchCaseValidationRulesCollection {

  constructor(conditionExpression, config) {
    this.conditionExpression = conditionExpression;
    this.config = config;
    this.innerCollections = [];
    this.defaultCollection = new ValidationRulesCollection(this.config);
    this.caseLabel = '';
    this.defaultCaseLabel = {description: 'this is the case label for \'default\''};
  }

  case(caseLabel) {
    this.caseLabel = caseLabel;
    this.getCurrentCollection(caseLabel, true); //force creation
  }

  default() {
    this.caseLabel = this.defaultCaseLabel;
  }

  getCurrentCollection(caseLabel, createIfNotExists = false) {
    if (caseLabel === this.defaultCaseLabel)
      return this.defaultCollection;
    var currentCollection = null;
    for (let i = 0; i < this.innerCollections.length; i++) {
      currentCollection = this.innerCollections[i];
      if (currentCollection.caseLabel === caseLabel)
        return currentCollection.collection;
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
    var collection = this.getCurrentCollection(this.conditionExpression(newValue));
    if (collection !== null)
      return collection.validate(newValue, locale);
    else
      return this.defaultCollection.validate(newValue, locale);
  }

  addValidationRule(validationRule) {
    var currentCollection = this.getCurrentCollection(this.caseLabel, true);
    currentCollection.addValidationRule(validationRule);
  }

  addValidationRuleCollection(validationRulesCollection) {
    var currentCollection = this.getCurrentCollection(this.caseLabel, true);
    currentCollection.addValidationRuleCollection(validationRulesCollection);
  }

  isNotEmpty() {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null)
      collection.isNotEmpty();
    else
      this.defaultCollection.isNotEmpty();
  }

  canBeEmpty() {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null)
      collection.canBeEmpty();
    else
      this.defaultCollection.canBeEmpty();
  }

  withMessage(message) {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null)
      collection.withMessage(message);
    else
      this.defaultCollection.withMessage(message);
  }
}
