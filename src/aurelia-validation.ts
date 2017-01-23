// Exports

export * from './controller-validate-result';
export * from './property-info';
export * from './validate-binding-behavior';
export * from './validate-instruction';
export * from './validate-result';
export * from './validate-trigger';
export * from './validation-controller';
export * from './validation-controller-factory';
export * from './validation-errors-custom-attribute';
export * from './validation-renderer-custom-attribute';
export * from './validation-renderer';
export * from './validator';

export * from './implementation/rule';
export * from './implementation/rules';
export * from './implementation/standard-validator';
export * from './implementation/validation-messages';
export * from './implementation/validation-parser';
export * from './implementation/validation-rules';
export * from './implementation/decorators';

// Configuration

import { Container } from 'aurelia-dependency-injection';
import { Validator } from './validator';
import { StandardValidator } from './implementation/standard-validator';
import { ValidationParser } from './implementation/validation-parser';
import { ValidationRules } from './implementation/validation-rules';

/**
 * Aurelia Validation Configuration API
 */
export class AureliaValidationConfiguration {
  private validatorType: { new (...args: any[]): Validator } = StandardValidator;

  /**
   * Use a custom Validator implementation.
   */
  public customValidator(type: { new (...args: any[]): Validator }) {
    this.validatorType = type;
  }

  /**
   * Applies the configuration.
   */
  public apply(container: Container) {
    const validator = container.get(this.validatorType);
    container.registerInstance(Validator, validator);
  }
}

/**
 * Configures the plugin.
 */
export function configure(
  frameworkConfig: { container: Container, globalResources?: (...resources: string[]) => any },
  callback?: (config: AureliaValidationConfiguration) => void
) {
  // the fluent rule definition API needs the parser to translate messages
  // to interpolation expressions. 
  const parser = frameworkConfig.container.get(ValidationParser);
  ValidationRules.initialize(parser);

  // configure...
  const config = new AureliaValidationConfiguration();
  if (callback instanceof Function) {
    callback(config);
  }
  config.apply(frameworkConfig.container);

  // globalize the behaviors.
  if (frameworkConfig.globalResources) {
    frameworkConfig.globalResources(
      './validate-binding-behavior',
      './validation-errors-custom-attribute',
      './validation-renderer-custom-attribute');
  }
}
