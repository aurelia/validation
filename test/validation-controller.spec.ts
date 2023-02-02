import {
  GlobalValidationConfiguration,
  PropertyAccessorParser,
  ValidationController,
  Validator,
  validateTrigger,
} from '../src/aurelia-validation';

describe('ValidationController', () => {
  it('takes a validator, a PropertyAccessorParser, and optional config', () => {
    const validator = {} as any as Validator;
    const parser = {} as any as PropertyAccessorParser;
    const controller = new ValidationController(validator, parser);
    expect(controller.validateTrigger).toBe(GlobalValidationConfiguration.DEFAULT_VALIDATION_TRIGGER);

    const trigger = validateTrigger.changeOrBlur;
    const config = new GlobalValidationConfiguration();
    config.defaultValidationTrigger(trigger);
    const controllerWithConfig = new ValidationController(validator, parser, config);
    expect(controllerWithConfig.validateTrigger).toBe(trigger);
  });
});
