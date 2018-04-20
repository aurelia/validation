// Exports

export * from './controller-validate-result';
export * from './get-target-dom-element';
export * from './property-info';
export * from './validate-binding-behavior';
export * from './validate-event';
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
export * from './implementation/validation-message-parser';
export * from './implementation/validation-rules';

// Configuration

import { PLATFORM } from 'aurelia-pal';
import { Container } from 'aurelia-dependency-injection';
import { Validator } from './validator';
import { StandardValidator } from './implementation/standard-validator';
import { ValidationMessageParser } from './implementation/validation-message-parser';
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
  const messageParser = frameworkConfig.container.get(ValidationMessageParser);
  ValidationRules.initialize(messageParser);

  // configure...
  const config = new AureliaValidationConfiguration();
  if (callback instanceof Function) {
    callback(config);
  }
  config.apply(frameworkConfig.container);

  // globalize the behaviors.
  if (frameworkConfig.globalResources) {
    frameworkConfig.globalResources(
      PLATFORM.moduleName('./validate-binding-behavior'),
      PLATFORM.moduleName('./validation-errors-custom-attribute'),
      PLATFORM.moduleName('./validation-renderer-custom-attribute'));
  }
}
