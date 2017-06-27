import { ValidationController } from './validation-controller';
import { Validator } from './validator';
import { PropertyAccessorParser } from './property-accessor-parser';
/**
 * Creates ValidationController instances.
 */
export class ValidationControllerFactory {
    constructor(container) {
        this.container = container;
    }
    static get(container) {
        return new ValidationControllerFactory(container);
    }
    /**
     * Creates a new controller instance.
     */
    create(validator) {
        if (!validator) {
            validator = this.container.get(Validator);
        }
        const propertyParser = this.container.get(PropertyAccessorParser);
        return new ValidationController(validator, propertyParser);
    }
    /**
     * Creates a new controller and registers it in the current element's container so that it's
     * available to the validate binding behavior and renderers.
     */
    createForCurrentScope(validator) {
        const controller = this.create(validator);
        this.container.registerInstance(ValidationController, controller);
        return controller;
    }
}
ValidationControllerFactory['protocol:aurelia:resolver'] = true;
