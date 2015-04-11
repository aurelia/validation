import {Validation} from '../validation/validation';

export class ValidationRulesCollection {
  constructor() {
    this.isRequired = false;
    this.validationRules = [];
    this.validationCollections = [];
  }




  /**
   * Returns a promise that fulfils and resolves to simple result status object.
   */
  validate(newValue) {
    let executeRules = true;

    //Is required?
    if (Validation.Utilities.isEmptyValue(newValue)) {
      if (this.isRequired) {
        return Promise.resolve({
          isValid: false,
          message: Validation.Locale.translate('isRequired'),
          failingRule: 'isRequired'
        });
      }
      else {
        executeRules = false;
      }
    }

    var checks = Promise.resolve({
      isValid: true,
      message: '',
      failingRule: null
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
            return rule.validate(newValue).then( (thisRuleResult) => {
              if(thisRuleResult === false) {
                return {
                  isValid: false,
                  message: rule.explain(),
                  failingRule: rule.ruleName
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
          return validationCollection.validate(newValue);
        else
          return previousValidationResult;
      });
    }

    return checks;
  }

  addValidationRule(validationRule) {
    if (validationRule.validate === undefined) //Can ES6 check on base class??
      throw new exception("That's not a valid validationRule");
    this.validationRules.push(validationRule);
  }

  addValidationRuleCollection(validationRulesCollection) {
    this.validationCollections.push(validationRulesCollection);
  }

  notEmpty() {
    this.isRequired = true;
  }

  withMessage(message) {
    this.validationRules[this.validationRules.length - 1].withMessage(message);
  }
}

export class SwitchCaseValidationRulesCollection {

  constructor(conditionExpression) {
    this.conditionExpression = conditionExpression;
    this.innerCollections = [];
    this.defaultCollection = new ValidationRulesCollection();
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
        collection: new ValidationRulesCollection()
      };
      this.innerCollections.push(currentCollection);
      return currentCollection.collection;
    }
    return null;
  }

  validate(newValue) {
    var collection = this.getCurrentCollection(this.conditionExpression(newValue));
    if (collection !== null)
      return collection.validate(newValue);
    else
      return this.defaultCollection.validate(newValue);
  }

  addValidationRule(validationRule) {
    var currentCollection = this.getCurrentCollection(this.caseLabel, true);
    currentCollection.addValidationRule(validationRule);
  }

  addValidationRuleCollection(validationRulesCollection) {
    var currentCollection = this.getCurrentCollection(this.caseLabel, true);
    currentCollection.addValidationRuleCollection(validationRulesCollection);
  }

  notEmpty() {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null)
      collection.notEmpty();
    else
      this.defaultCollection.notEmpty();
  }

  withMessage(message) {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null)
      collection.withMessage(message);
    else
      this.defaultCollection.withMessage(message);
  }
}
