var _dec, _class;

import { ObserverLocator } from 'aurelia-binding';
import { ValidationGroup } from './validation-group';
import { inject } from 'aurelia-dependency-injection';
import { ValidationConfig } from './validation-config';

export let Validation = (_dec = inject(ObserverLocator), _dec(_class = class Validation {
  constructor(observerLocator, validationConfig) {
    this.observerLocator = observerLocator;
    this.config = validationConfig ? validationConfig : Validation.defaults;
  }

  on(subject, configCallback) {
    let conf = new ValidationConfig(this.config);
    if (configCallback !== null && configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(conf);
    }
    return new ValidationGroup(subject, this.observerLocator, conf);
  }
  onBreezeEntity(breezeEntity, configCallback) {
    let validation = this.on(breezeEntity, configCallback);
    validation.onBreezeEntity();
    return validation;
  }
}) || _class);
Validation.defaults = new ValidationConfig();