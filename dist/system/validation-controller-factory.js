System.register(['./validation-controller'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var validation_controller_1;
    var ValidationControllerFactory;
    return {
        setters:[
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
            exports_1("ValidationControllerFactory", ValidationControllerFactory);
            ValidationControllerFactory['protocol:aurelia:resolver'] = true;
        }
    }
});
