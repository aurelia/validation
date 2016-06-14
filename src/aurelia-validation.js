export {ValidateBindingBehavior} from './validate-binding-behavior';
export {validateTrigger} from './validate-trigger';
export {ValidationController} from './validation-controller';
export {ValidationError} from './validation-error';
export {ValidationErrorsCustomAttribute} from './validation-errors-custom-attribute';
export {ValidationRendererCustomAttribute} from './validation-renderer-custom-attribute';
export {validationRenderer} from './validation-renderer';
export {Validator} from './validator';

export function configure(config) {
  config.globalResources(
    './validate-binding-behavior',
    './validation-errors-custom-attribute',
    './validation-renderer-custom-attribute');
}
