import { ValidationController } from './validation-controller';
import { Validator } from './validator';
import { PropertyAccessorParser } from './property-accessor-parser';
/**
 * Creates ValidationController instances.
 */
var ValidationControllerFactory = /** @class */ (function () {
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
        var propertyParser = this.container.get(PropertyAccessorParser);
        return new ValidationController(validator, propertyParser);
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
export { ValidationControllerFactory };
ValidationControllerFactory['protocol:aurelia:resolver'] = true;
