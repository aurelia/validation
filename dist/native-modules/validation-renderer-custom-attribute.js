

import { ValidationController } from './validation-controller';

export var ValidationRendererCustomAttribute = function () {
  function ValidationRendererCustomAttribute() {
    
  }

  ValidationRendererCustomAttribute.prototype.created = function created(view) {
    this.container = view.container;
  };

  ValidationRendererCustomAttribute.prototype.bind = function bind() {
    this.controller = this.container.get(ValidationController);
    this.renderer = this.container.get(this.value);
    this.controller.addRenderer(this.renderer);
  };

  ValidationRendererCustomAttribute.prototype.unbind = function unbind() {
    this.controller.removeRenderer(this.renderer);
    this.controller = null;
    this.renderer = null;
  };

  return ValidationRendererCustomAttribute;
}();