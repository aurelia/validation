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

export function configure(config: { container: Container, globalResources: (...resources: string[]) => any }) {
  // the fluent rule definition API needs the parser to translate messages
  // to interpolation expressions. 
  const parser = config.container.get(ValidationParser);
  ValidationRules.initialize(parser);

  // register the standard implementation of the Validator abstract class.
  const validator = config.container.get(StandardValidator);
  config.container.registerInstance(Validator, validator);

  // globalize the behaviors.
  config.globalResources(
    './validate-binding-behavior',
    './validation-errors-custom-attribute',
    './validation-renderer-custom-attribute');
}
