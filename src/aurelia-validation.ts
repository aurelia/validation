// Exports

export * from './validate-binding-behavior';
export * from './validate-trigger';
export * from './validation-controller';
export * from './validation-controller-factory';
export * from './validation-error';
export * from './validation-errors-custom-attribute';
export * from './validation-renderer-custom-attribute';
export * from './validation-renderer';
export * from './validator';

export * from './implementation/metadata-key';
export * from './implementation/rule';
export * from './implementation/standard-validator';
export * from './implementation/validation-messages';
export * from './implementation/validation-parser';
export * from './implementation/validation-rules';

// Configuration

import {Container} from 'aurelia-dependency-injection';
import {Validator} from './validator';
import {StandardValidator} from './implementation/standard-validator';
import {ValidationParser} from './implementation/validation-parser';
import {ValidationRules} from './implementation/validation-rules';

export function configure(
  frameworkConfig: { container: Container, globalResources: (...resources: string[]) => any },
  config: { customValidator?: boolean }
) {
  // the fluent rule definition API needs the parser to translate messages
  // to interpolation expressions. 
  const parser = frameworkConfig.container.get(ValidationParser);
  ValidationRules.initialize(parser);

  if (!config.customValidator) {
    // register the standard implementation of the Validator abstract class.
    const validator = frameworkConfig.container.get(StandardValidator);
    frameworkConfig.container.registerInstance(Validator, validator);
  }

  // globalize the behaviors.
  frameworkConfig.globalResources(
    './validate-binding-behavior',
    './validation-errors-custom-attribute',
    './validation-renderer-custom-attribute');
}
