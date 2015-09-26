import {ValidationRulesCollection} from './validation-rules-collection';
import {PathObserver} from './path-observer';
import {Debouncer} from './debouncer';

export class ValidationProperty {
  constructor(observerLocator, propertyName, validationGroup, propertyResult, config) {
    this.propertyResult = propertyResult;
    this.propertyName = propertyName;
    this.validationGroup = validationGroup;
    this.collectionOfValidationRules = new ValidationRulesCollection(config);
    this.config = config;
    this.latestValue = undefined;
    this.observer = new PathObserver(observerLocator, validationGroup.subject, propertyName)
      .getObserver();
    this.debouncer = new Debouncer(config.getDebounceTimeout());
    this.subscription = this.observer.subscribe(() => {
      this.debouncer.debounce(() => {
        let newValue =   this.observer.getValue();
        if (newValue !== this.latestValue) {
          this.validate(newValue, true);
        }
      });
    });
    this.dependencyObservers = [];
    let dependencies = this.config.getDependencies();
    for (let i = 0; i < dependencies.length; i++) {
      let dependencyObserver = new PathObserver(observerLocator, validationGroup.subject, dependencies[i])
        .getObserver();
      dependencyObserver.subscribe(() => {
        this.debouncer.debounce(() => {
          this.validateCurrentValue(/*forceDirty:*/ false, /*forceExecution:*/ true);
        });
      });
      this.dependencyObservers.push(dependencyObserver);
    }
  }
  addValidationRule(validationRule) {
    if (validationRule.validate === undefined) {
      throw new Error("That's not a valid validationRule");
    }
    this.collectionOfValidationRules.addValidationRule(validationRule);
    this.validateCurrentValue(false);
  }
  validateCurrentValue(forceDirty, forceExecution) {
    return this.validate(this.observer.getValue(), forceDirty, forceExecution);
  }
  clear() {
    this.latestValue = this.observer.getValue();
    this.propertyResult.clear();
  }
  destroy() {
    if (this.subscription) {
      this.subscription();
    }
    // TODO: what else needs to be done for proper cleanup?
  }
  /**
   * returns a promise that fulfils and resolves to true/false
   */
  validate(newValue, shouldBeDirty, forceExecution) {
    if ((!this.propertyResult.isDirty && shouldBeDirty) || this.latestValue !== newValue || forceExecution) {
      this.latestValue = newValue;
      return this.config.locale().then((locale) => {
        return this.collectionOfValidationRules.validate(newValue, locale)
          .then((validationResponse) => {
            if (this.latestValue === validationResponse.latestValue) {
              this.propertyResult.setValidity(validationResponse, shouldBeDirty);
            }
            return validationResponse.isValid;
          })
          .catch((err) => {
            throw Error('Unexpected behavior: a validation-rules-collection should always fulfil');
          });
      },
      () => {
        throw Error('An exception occurred while trying to load the locale');
      });
    }
  }
}
