System.register(["./validation-controller"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var validation_controller_1, ValidationRendererCustomAttribute;
    return {
        setters: [
            function (validation_controller_1_1) {
                validation_controller_1 = validation_controller_1_1;
            }
        ],
        execute: function () {
            ValidationRendererCustomAttribute = /** @class */ (function () {
                function ValidationRendererCustomAttribute() {
                }
                ValidationRendererCustomAttribute.prototype.created = function (view) {
                    this.container = view.container;
                };
                ValidationRendererCustomAttribute.prototype.bind = function () {
                    this.controller = this.container.get(validation_controller_1.ValidationController);
                    this.renderer = this.container.get(this.value);
                    this.controller.addRenderer(this.renderer);
                };
                ValidationRendererCustomAttribute.prototype.unbind = function () {
                    this.controller.removeRenderer(this.renderer);
                    this.controller = null;
                    this.renderer = null;
                };
                return ValidationRendererCustomAttribute;
            }());
            exports_1("ValidationRendererCustomAttribute", ValidationRendererCustomAttribute);
        }
    };
});
