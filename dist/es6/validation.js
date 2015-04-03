export * from './validation/validation-locale-repository';
export * from './validation/validation-result';
export * from './validation/validation-rules';
export * from './validation/validation-rules-collection';
export * from './validation/validation-group-builder';
export * from './validation/validation';
export * from './validation/validate-attached-behavior';
export * from './validation/validate-attached-behavior-config'

export function install(aurelia) {
  aurelia.globalizeResources('./validation/validate-attached-behavior');
}
