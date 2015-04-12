export {Utilities} from './validation/utilities';
export {ValidationConfig} from './validation/validation-config';
export {ValidationLocale} from './validation/validation-locale';
export * from './validation/validation-result';
export * from './validation/validation-rules';
export {Validation} from './validation/validation';
export {ValidateAttachedBehavior} from './validation/validate-attached-behavior';
export {ValidateAttachedBehaviorConfig} from './validation/validate-attached-behavior-config';

import {Validation} from './validation/validation';

export function install(aurelia, configCallback) {
  aurelia.globalizeResources('./validation/validate-attached-behavior');
  if(configCallback !== undefined && typeof(configCallback === 'function'))
  {
    configCallback(Validation.defaults);
  }
  return Validation.defaults.locale();
}
