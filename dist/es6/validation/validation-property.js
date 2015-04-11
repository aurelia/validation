import * as AllCollections from '../validation/validation-rules-collection';
import {PathObserver} from '../validation/path-observer';
import {Debouncer} from '../validation/debouncer';

export class ValidationProperty {
  constructor(observerLocator, propertyName, validationGroup, propertyResult) {
    this.propertyResult = propertyResult;
    this.propertyName = propertyName;
    this.validationGroup = validationGroup;
    this.validationRules = new AllCollections.ValidationRulesCollection();

    this.observer = new PathObserver(observerLocator, validationGroup.subject, propertyName)
      .getObserver();

    let debouncer = new Debouncer();

    this.observer.subscribe(() => {
      debouncer.debounce( () => { this.validateCurrentValue(true); });
    });
  }


  addValidationRule(validationRule) {
    if (validationRule.validate === undefined) //Can ES6 check on base class??
      throw new exception("That's not a valid validationRule");
    this.validationRules.addValidationRule(validationRule);
    this.validateCurrentValue(false);
  }

  validateCurrentValue(forceDirty) {
    return this.validate(this.observer.getValue(), forceDirty);
  }

  /**
   * returns a promise that fulfils and resolves to true/false
   */
  validate(newValue, shouldBeDirty) {
    return this.validationRules.validate(newValue)
        .then( (validationResponse) => {
        this.propertyResult.setValidity(validationResponse, shouldBeDirty);
        return validationResponse.isValid;
      })
      .catch( (err) => {
        console.log("Unexpected behavior: a validation-rules-collection should always fulfil", err);
        debugger;
        throw Error("Unexpected behavior: a validation-rules-collection should always fulfil");
      });
  }
}
