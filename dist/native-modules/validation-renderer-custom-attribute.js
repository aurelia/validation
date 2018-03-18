import { ValidationController } from './validation-controller';
var ValidationRendererCustomAttribute = /** @class */ (function () {
    function ValidationRendererCustomAttribute() {
    }
    ValidationRendererCustomAttribute.prototype.created = function (view) {
        this.container = view.container;
    };
    ValidationRendererCustomAttribute.prototype.bind = function () {
        this.controller = this.container.get(ValidationController);
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
export { ValidationRendererCustomAttribute };
