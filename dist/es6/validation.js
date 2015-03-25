export * from './validation/validationLocaleRepository';
export * from './validation/validationResult';
export * from './validation/validationRules';
export * from './validation/validationRulesCollection';
export * from './validation/validationGroupBuilder';
export * from './validation/validation';
export * from './validation/validateAttachedBehavior';
export * from './validation/validateAttachedBehaviorConfig'

import {ValidateAttachedBehavior} from './validation/validateAttachedBehavior'

export function install(aurelia)
{
	aurelia.withResources(ValidateAttachedBehavior);
}
