import { ValidationController } from './validation-controller';
import { Validator } from './validator';
/**
 * Creates ValidationController instances.
 */
export var ValidationControllerFactory = (function () {
    function ValidationControllerFactory(container) {
        this.container = container;
    }
    ValidationControllerFactory.get = function (container) {
        return new ValidationControllerFactory(container);
    };
    /**
     * Creates a new controller instance.
     */
    ValidationControllerFactory.prototype.create = function (validator) {
        if (!validator) {
            validator = this.container.get(Validator);
        }
        return new ValidationController(validator);
    };
    /**
     * Creates a new controller and registers it in the current element's container so that it's
     * available to the validate binding behavior and renderers.
     */
    ValidationControllerFactory.prototype.createForCurrentScope = function (validator) {
        var controller = this.create(validator);
        this.container.registerInstance(ValidationController, controller);
        return controller;
    };
    return ValidationControllerFactory;
}());
ValidationControllerFactory['protocol:aurelia:resolver'] = true;
