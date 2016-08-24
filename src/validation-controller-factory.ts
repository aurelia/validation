import {Container} from 'aurelia-dependency-injection';
import {ValidationController} from './validation-controller';

/**
 * Creates ValidationController instances.
 */
export class ValidationControllerFactory {
  static inject = [Container];

  constructor(private container: Container) {}

  /**
   * Creates a new controller and registers it in the current element's container so that it's 
   * available to the validate binding behavior and renderers.
   */
  create() {
    return this.container.invoke(ValidationController);
  }

  /**
   * Creates a new controller and registers it in the current element's container so that it's 
   * available to the validate binding behavior and renderers.
   */
  createForCurrentScope() {
    const controller = this.create();
    this.container.registerInstance(ValidationController, controller);
    return controller;
  }
}
