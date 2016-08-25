"use strict";
var aurelia_dependency_injection_1 = require('aurelia-dependency-injection');
var validation_controller_1 = require('./validation-controller');
/**
 * Creates ValidationController instances.
 */
var ValidationControllerFactory = (function () {
    function ValidationControllerFactory(container) {
        this.container = container;
    }
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
    ValidationControllerFactory.inject = [aurelia_dependency_injection_1.Container];
    return ValidationControllerFactory;
}());
exports.ValidationControllerFactory = ValidationControllerFactory;
