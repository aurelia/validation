System.register(['aurelia-dependency-injection', './validation-controller'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var aurelia_dependency_injection_1, validation_controller_1;
    var ValidationControllerFactory;
    return {
        setters:[
            function (aurelia_dependency_injection_1_1) {
                aurelia_dependency_injection_1 = aurelia_dependency_injection_1_1;
            },
            function (validation_controller_1_1) {
                validation_controller_1 = validation_controller_1_1;
            }],
        execute: function() {
            /**
             * Creates ValidationController instances.
             */
            ValidationControllerFactory = (function () {
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
            exports_1("ValidationControllerFactory", ValidationControllerFactory);
        }
    }
});
