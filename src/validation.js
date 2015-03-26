export * from './validation/validationLocaleRepository';
export * from './validation/validationResult';
export * from './validation/validationRules';
export * from './validation/validationRulesCollection';
export * from './validation/validationGroupBuilder';
export * from './validation/validation';
export * from './validation/validateAttachedBehavior';
export * from './validation/validateAttachedBehaviorConfig'

export function install(aurelia)
{
  aurelia.globalizeResources('./validation/validateAttachedBehavior');
}
