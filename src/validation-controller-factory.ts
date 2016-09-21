import {Container} from 'aurelia-dependency-injection';
import {ValidationController} from './validation-controller';
import {Validator} from './validator';

/**
 * Creates ValidationController instances.
 */
export class ValidationControllerFactory {
  static get(container: Container) {
    return new ValidationControllerFactory(container);
  }

  constructor(private container: Container) {}

  /**
   * Creates a new controller and registers it in the current element's container so that it's 
   * available to the validate binding behavior and renderers.
   */
  create(validator?: Validator) {
    return this.container.invoke(ValidationController, [validator]);
  }

  /**
   * Creates a new controller and registers it in the current element's container so that it's 
   * available to the validate binding behavior and renderers.
   */
  createForCurrentScope(validator?: Validator) {
    const controller = this.create(validator);
    this.container.registerInstance(ValidationController, controller);
    return controller;
  }
}

(<any>ValidationControllerFactory)['protocol:aurelia:resolver'] = true;
