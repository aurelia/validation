import { Container } from 'aurelia-dependency-injection';
import { Validator } from './validator';
import { StandardValidator } from './implementation/standard-validator';
import { validateTrigger } from './validate-trigger';

/**
 * Aurelia Validation Configuration API
 */
export class AureliaValidationConfiguration {
  public static DEFAULT_VALIDATION_TRIGGER = validateTrigger.blur;

  private validatorType: { new (...args: any[]): Validator } = StandardValidator;
  private validationTrigger = AureliaValidationConfiguration.DEFAULT_VALIDATION_TRIGGER;

  /**
   * Use a custom Validator implementation.
   */
  public customValidator(type: { new (...args: any[]): Validator }) {
    this.validatorType = type;
  }

  public defaultValidationTrigger(trigger: validateTrigger) {
    this.validationTrigger = trigger;
  }

  public getDefaultValidationTrigger() {
    return this.validationTrigger;
  }

  /**
   * Applies the configuration.
   */
  public apply(container: Container) {
    const validator = container.get(this.validatorType);
    container.registerInstance(Validator, validator);
    container.registerInstance(AureliaValidationConfiguration, this);
  }
}
