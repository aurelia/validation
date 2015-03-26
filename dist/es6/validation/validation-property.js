import * as AllCollections from '../validation/validation-rules-collection'
import {PathObserver} from '../validation/path-observer'

export class ValidationProperty {
  constructor(observerLocator, propertyName, validationGroup, propertyResult) {
    this.propertyResult = propertyResult;
    this.propertyName = propertyName;
    this.validationGroup = validationGroup;
    this.validationRules = new AllCollections.ValidationRulesCollection();

    this.observer = new PathObserver(observerLocator, validationGroup.subject, propertyName)
      .getObserver();

    this.observer.subscribe((newValue, oldValue) => {
      this.validate(newValue, true);
    });
  }


  addValidationRule(validationRule) {
    if (validationRule.validate === undefined) //Can ES6 check on base class??
      throw new exception("That's not a valid validationRule");
    this.validationRules.addValidationRule(validationRule);
    this.validateCurrentValue(false);
  }

  validateCurrentValue(forceDirty) {
    this.validate(this.observer.getValue(), forceDirty);
  }

  validate(newValue, shouldBeDirty) {
    var validationResponse = this.validationRules.validate(newValue);
    this.propertyResult.setValidity(validationResponse, shouldBeDirty);
  }
}
