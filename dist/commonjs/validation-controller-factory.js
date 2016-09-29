"use strict";
var validation_controller_1 = require('./validation-controller');
var validator_1 = require('./validator');
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
     * Creates a new controller instance.
     */
    ValidationControllerFactory.prototype.create = function (validator) {
        if (!validator) {
            validator = this.container.get(validator_1.Validator);
        }
        return new validation_controller_1.ValidationController(validator);
    };
    /**
     * Creates a new controller and registers it in the current element's container so that it's
     * available to the validate binding behavior and renderers.
     */
    ValidationControllerFactory.prototype.createForCurrentScope = function (validator) {
        var controller = this.create(validator);
        this.container.registerInstance(validation_controller_1.ValidationController, controller);
        return controller;
    };
    return ValidationControllerFactory;
}());
exports.ValidationControllerFactory = ValidationControllerFactory;
ValidationControllerFactory['protocol:aurelia:resolver'] = true;
