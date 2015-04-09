import {ObserverLocator} from 'aurelia-binding';
import * as AllRules from '../validation/validation-rules';
import * as AllCollections from '../validation/validation-rules-collection'
import {ValidationGroup} from '../validation/validation-group';
import {ValidationLocaleRepository} from '../validation/validation-locale-repository';

/**
 * A lightweight validation plugin
 * @class Validation
 * @constructor
 */
@inject(ObserverLocator)
export class Validation {
  /**
   * Instantiates a new {Validation}
   * @param observerLocator the observerLocator used to observer properties
   */
  constructor(observerLocator) {
    this.observerLocator = observerLocator;
  }

  /**
   * Returns a new validation group on the subject
   * @param subject The subject to validate
   * @returns {ValidationGroup} A ValidationGroup that encapsulates the validation rules and current validation state for this subject
   */
  on(subject) {
    return new ValidationGroup(subject, this.observerLocator);
  }
}

Validation.Utilities = {
  isEmptyValue(val) {
    if (typeof val === 'function') {
      return this.isEmptyValue(val());
    }
    if (val === undefined) {
      return true;
    }
    if (val === null) {
      return true;
    }
    if (val === "") {
      return true;
    }
    if (typeof (val) === 'string') {
      if (String.prototype.trim) {
        val = val.trim();
      }
      else {
        val = val.replace(/^\s+|\s+$/g, '');
      }
    }

    if (val.length !== undefined) {
      return 0 === val.length;
    }
    return false;
  }
};
Validation.Locale = new ValidationLocaleRepository();

Validation.debounceTime = 150;
