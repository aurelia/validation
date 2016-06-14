define(['exports', './validation-controller'], function (exports, _validationController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ValidationRendererCustomAttribute = undefined;

  

  var ValidationRendererCustomAttribute = exports.ValidationRendererCustomAttribute = function () {
    function ValidationRendererCustomAttribute() {
      
    }

    ValidationRendererCustomAttribute.prototype.created = function created(view) {
      this.container = view.container;
    };

    ValidationRendererCustomAttribute.prototype.bind = function bind() {
      this.controller = this.container.get(_validationController.ValidationController);
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
});