import * as AllCollections from '../validation/validation-rules-collection';
import {PathObserver} from '../validation/path-observer';
import {Debouncer} from '../validation/debouncer';

export class ValidationProperty {
  constructor(observerLocator, propertyName, validationGroup, propertyResult, config) {
    this.propertyResult = propertyResult;
    this.propertyName = propertyName;
    this.validationGroup = validationGroup;
    this.collectionOfValidationRules = new AllCollections.ValidationRulesCollection();
    this.config = config;

    this.observer = new PathObserver(observerLocator, validationGroup.subject, propertyName)
      .getObserver();

    this.debouncer = new Debouncer(config.getDebounceTimeout());

    this.observer.subscribe(() => {
      this.debouncer.debounce( () => { this.validateCurrentValue(true); });
    });

    this.dependencyObservers = [];
    var dependencies = this.config.getDependencies();
    for(let i = 0; i < dependencies.length; i++){
      let dependencyObserver = new PathObserver(observerLocator, validationGroup.subject, dependencies[i])
        .getObserver();
      dependencyObserver.subscribe(() => {
        this.debouncer.debounce( () => { this.validateCurrentValue(true); });
      });
      this.dependencyObservers.push(dependencyObserver);
    }
  }

  addValidationRule(validationRule) {
    if (validationRule.validate === undefined) //Can ES6 check on base class??
      throw new exception("That's not a valid validationRule");
    this.collectionOfValidationRules.addValidationRule(validationRule);
    this.validateCurrentValue(false);
  }

  validateCurrentValue(forceDirty) {
    return this.validate(this.observer.getValue(), forceDirty);
  }

  /**
   * returns a promise that fulfils and resolves to true/false
   */
  validate(newValue, shouldBeDirty) {
    return this.config.locale().then( (locale) => {
      return this.collectionOfValidationRules.validate(newValue, locale)
        .then( (validationResponse) => {
        this.propertyResult.setValidity(validationResponse, shouldBeDirty);
        return validationResponse.isValid;
      })
      .catch( (err) => {
        console.log("Unexpected behavior: a validation-rules-collection should always fulfil", err);
        debugger;
        throw Error("Unexpected behavior: a validation-rules-collection should always fulfil");
      });
    },
    () => {
      throw Error("An exception occurred while trying to load the locale");
    });
  }
}
