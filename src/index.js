export {Utilities} from './validation/utilities';
export {ValidationConfig} from './validation/validation-config';
export {ValidationLocale} from './validation/validation-locale';
export * from './validation/validation-result';
export * from './validation/validation-rules';
export {Validation} from './validation/validation';
export {ValidateCustomAttribute} from './validation/validate-custom-attribute';
export {ValidateCustomAttributeViewStrategy} from './validation/validate-custom-attribute-view-strategy';
export {ValidateCustomAttributeViewStrategyBase} from './validation/validate-custom-attribute-view-strategy';
export {ensure} from './validation/decorators';


import {ValidationConfig} from './validation/validation-config';
import {Validation} from './validation/validation';

export function configure(frameworkConfig, configCallback) {

  frameworkConfig.globalResources('./validation/validate-custom-attribute');
  if(configCallback !== undefined && typeof(configCallback) === 'function')
  {
    configCallback(Validation.defaults);
  }
  frameworkConfig.singleton(ValidationConfig, Validation.defaults);
  return Validation.defaults.locale();
}
