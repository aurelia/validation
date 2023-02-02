import { Container } from 'aurelia-dependency-injection';
import { Validator } from './validator';
import { StandardValidator } from './implementation/standard-validator';
import { validateTrigger } from './validate-trigger';

export type ValidatorCtor = new (...args: any[]) => Validator;

/**
 * Aurelia Validation Configuration API
 */
export class GlobalValidationConfiguration {
  public static DEFAULT_VALIDATION_TRIGGER = validateTrigger.blur;

  private validatorType: ValidatorCtor = StandardValidator;
  private validationTrigger = GlobalValidationConfiguration.DEFAULT_VALIDATION_TRIGGER;

  /**
   * Use a custom Validator implementation.
   */
  public customValidator(type: ValidatorCtor) {
    this.validatorType = type;
    return this;
  }

  public defaultValidationTrigger(trigger: validateTrigger) {
    this.validationTrigger = trigger;
    return this;
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
    container.registerInstance(GlobalValidationConfiguration, this);
  }
}
