"use strict";
var validation_controller_1 = require('./validation-controller');
/**
 * Creates ValidationController instances.
 */
var ValidationControllerFactory = (function () {
    function ValidationControllerFactory(container) {
        this.container = container;
    }
    ValidationControllerFactory.get = function (container) {
        return new ValidationControllerFactory(container);
    };
    /**
     * Creates a new controller and registers it in the current element's container so that it's
     * available to the validate binding behavior and renderers.
     */
    ValidationControllerFactory.prototype.create = function () {
        return this.container.invoke(validation_controller_1.ValidationController);
    };
    /**
     * Creates a new controller and registers it in the current element's container so that it's
     * available to the validate binding behavior and renderers.
     */
    ValidationControllerFactory.prototype.createForCurrentScope = function () {
        var controller = this.create();
        this.container.registerInstance(validation_controller_1.ValidationController, controller);
        return controller;
    };
    return ValidationControllerFactory;
}());
exports.ValidationControllerFactory = ValidationControllerFactory;
ValidationControllerFactory['protocol:aurelia:resolver'] = true;
