import {ObserverLocator} from 'aurelia-binding';
import {ValidationGroup} from './validation-group';
import {inject} from 'aurelia-dependency-injection';
import {ValidationConfig} from './validation-config';

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
   * @param validationConfig the configuration
   */
  constructor(observerLocator, validationConfig: ValidationConfig) {
    this.observerLocator = observerLocator;
    this.config = validationConfig ? validationConfig : Validation.defaults;
  }

  /**
   * Returns a new validation group on the subject
   * @param subject The subject to validate
   * @returns {ValidationGroup} A ValidationGroup that encapsulates the validation rules and current validation state for this subject
   */
  on(subject: any, configCallback? : (conf: ValidationConfig) => void): ValidationGroup {
    let conf = new ValidationConfig(this.config);
    if (configCallback !== null && configCallback !== undefined && typeof(configCallback) === 'function') {
      configCallback(conf);
    }
    return new ValidationGroup(subject, this.observerLocator, conf);
  }
  onBreezeEntity(breezeEntity, configCallback? : (conf: ValidationConfig) => void): ValidationGroup {
    let validation = this.on(breezeEntity, configCallback);
    validation.onBreezeEntity();
    return validation;
  }
}
Validation.defaults = new ValidationConfig();
