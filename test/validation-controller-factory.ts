import { Container, Optional } from 'aurelia-dependency-injection';
import {
  GlobalValidationConfiguration,
  ValidationControllerFactory,
  ValidationController,
  Validator,
  validateTrigger
} from '../src/aurelia-validation';

describe('ValidationControllerFactory', () => {
  it('createForCurrentScope', () => {
    const container = new Container();
    const standardValidator = {};
    container.registerInstance(Validator, standardValidator);
    const config = new GlobalValidationConfiguration();
    config.defaultValidationTrigger(validateTrigger.manual);
    container.registerInstance(GlobalValidationConfiguration, config);
    const childContainer = container.createChild();
    const factory = childContainer.get(ValidationControllerFactory);
    const controller = factory.createForCurrentScope();
    expect(controller['validator']).toBe(standardValidator);
    expect(controller.validateTrigger).toBe(validateTrigger.manual);
    expect(container.get(Optional.of(ValidationController))).toBe(null);
    expect(childContainer.get(Optional.of(ValidationController))).toBe(controller);
    const customValidator = {};
    expect(factory.createForCurrentScope(customValidator as Validator)['validator']).toBe(customValidator);
  });
});
