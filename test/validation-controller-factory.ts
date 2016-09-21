import {Container, Optional} from 'aurelia-dependency-injection';
import {
  ValidationControllerFactory,
  ValidationController,
  Validator
} from '../src/aurelia-validation';

describe('ValidationControllerFactory', () => {
  it('createForCurrentScope', () => {
    const container = new Container();
    const childContainer = container.createChild();
    const factory = childContainer.get(ValidationControllerFactory);
    const controller = factory.createForCurrentScope();
    expect(container.get(Optional.of(ValidationController))).toBe(null);
    expect(childContainer.get(Optional.of(ValidationController))).toBe(controller);
  });

  it('createForCurrentScopeWithValidator', () => {
    const container = new Container();
    const childContainer = container.createChild();

    const factory = childContainer.get(ValidationControllerFactory);
    const validator = childContainer.get(Validator);

    const controller = factory.createForCurrentScope(validator);

    expect(controller.validator).toBe(validator);
  });
});
