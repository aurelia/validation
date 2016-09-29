import { Container } from 'aurelia-dependency-injection';
import { ValidationController } from './validation-controller';
import { Validator } from './validator';
/**
 * Creates ValidationController instances.
 */
export declare class ValidationControllerFactory {
    private container;
    static get(container: Container): ValidationControllerFactory;
    constructor(container: Container);
    /**
     * Creates a new controller instance.
     */
    create(validator?: Validator): ValidationController;
    /**
     * Creates a new controller and registers it in the current element's container so that it's
     * available to the validate binding behavior and renderers.
     */
    createForCurrentScope(validator?: Validator): ValidationController;
}
