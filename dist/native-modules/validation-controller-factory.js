import { Container } from 'aurelia-dependency-injection';
import { ValidationController } from './validation-controller';
/**
 * Creates ValidationController instances.
 */
export var ValidationControllerFactory = (function () {
    function ValidationControllerFactory(container) {
        this.container = container;
    }
    /**
     * Creates a new controller and registers it in the current element's container so that it's
     * available to the validate binding behavior and renderers.
     */
    ValidationControllerFactory.prototype.create = function () {
        return this.container.invoke(ValidationController);
    };
    /**
     * Creates a new controller and registers it in the current element's container so that it's
     * available to the validate binding behavior and renderers.
     */
    ValidationControllerFactory.prototype.createForCurrentScope = function () {
        var controller = this.create();
        this.container.registerInstance(ValidationController, controller);
        return controller;
    };
    ValidationControllerFactory.inject = [Container];
    return ValidationControllerFactory;
}());
