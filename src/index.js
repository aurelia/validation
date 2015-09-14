export {Utilities} from './validation/utilities';
export {ValidationConfig} from './validation/validation-config';
export {ValidationLocale} from './validation/validation-locale';
export * from './validation/validation-result';
export * from './validation/validation-rules';
export {Validation} from './validation/validation';
export {ValidationGroup} from './validation/validation-group';
export {ValidateCustomAttribute} from './validation/validate-custom-attribute';
export {ValidationViewStrategy} from './validation/validation-view-strategy';
export {TWBootstrapViewStrategy} from './strategies/twbootstrap-view-strategy';
export {ensure} from './validation/decorators';

import {ValidationConfig} from './validation/validation-config';
import {Validation} from './validation/validation';

export function configure(aurelia, configCallback) {
  aurelia.globalResources('./validation/validate-custom-attribute');
  if (configCallback !== undefined && typeof(configCallback) === 'function') {
    configCallback(Validation.defaults);
  }
  aurelia.singleton(ValidationConfig, Validation.defaults);
  return Validation.defaults.locale();
}
