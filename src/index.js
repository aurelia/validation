import {ValidationConfig} from './validation-config';
import {Validation} from './validation';

export function configure(aurelia, configCallback) {

  aurelia.globalResources('./validate-custom-attribute');
  if(configCallback !== undefined && typeof(configCallback) === 'function')
  {
    configCallback(Validation.defaults);
  }
  aurelia.singleton(ValidationConfig, Validation.defaults);
  return Validation.defaults.locale();
}
