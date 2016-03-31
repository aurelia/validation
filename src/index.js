export {Utilities} from './utilities';
export {ValidationConfig} from './validation-config';
export {ValidationLocale} from './validation-locale';
export * from './validation-result';
export * from './validation-rules';
export {Validation} from './validation';
export {ValidationGroup} from './validation-group';
export {ValidateCustomAttribute} from './validate-custom-attribute';
export {ValidationViewStrategy} from './validation-view-strategy';
export {TWBootstrapViewStrategy} from './strategies/twbootstrap-view-strategy';
export {ensure} from './decorators';

import {Loader} from 'aurelia-loader';
import {ValidationConfig} from './validation-config';
import {Validation} from './validation';

export function configure(aurelia, configCallback) {
  aurelia.globalResources('./validate-custom-attribute');
  if (configCallback !== undefined && typeof(configCallback) === 'function') {
    configCallback(Validation.defaults);
  }
  aurelia.singleton(ValidationConfig, Validation.defaults);
  const loader = aurelia.container.get(Loader);
  window.loader = window.loader || loader;
  return Validation.defaults.locale();
}
