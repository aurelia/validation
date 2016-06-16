'use strict';

System.register(['aurelia-binding', 'aurelia-dependency-injection', 'aurelia-templating', './validation-controller', './validation-renderer'], function (_export, _context) {
  "use strict";

  var bindingMode, inject, Lazy, customAttribute, ValidationController, validationRenderer, _dec, _dec2, _class, ValidationErrorsCustomAttribute;

  

  return {
    setters: [function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
      Lazy = _aureliaDependencyInjection.Lazy;
    }, function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
    }, function (_validationController) {
      ValidationController = _validationController.ValidationController;
    }, function (_validationRenderer) {
      validationRenderer = _validationRenderer.validationRenderer;
    }],
    execute: function () {
      _export('ValidationErrorsCustomAttribute', ValidationErrorsCustomAttribute = (_dec = customAttribute('validation-errors', bindingMode.twoWay), _dec2 = inject(Element, Lazy.of(ValidationController)), _dec(_class = _dec2(_class = validationRenderer(_class = function () {
        function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
          

          this.errors = [];

          this.boundaryElement = boundaryElement;
          this.controllerAccessor = controllerAccessor;
        }

        ValidationErrorsCustomAttribute.prototype.sort = function sort() {
          this.errors.sort(function (a, b) {
            if (a.target === b.target) {
              return 0;
            }
            return a.target.compareDocumentPosition(b.target) & 2 ? 1 : -1;
          });
        };

        ValidationErrorsCustomAttribute.prototype.render = function render(error, target) {
          if (!target || !(this.boundaryElement === target || this.boundaryElement.contains(target))) {
            return;
          }

          this.errors.push({ error: error, target: target });
          this.sort();
          this.value = this.errors;
        };

        ValidationErrorsCustomAttribute.prototype.unrender = function unrender(error, target) {
          var index = this.errors.findIndex(function (x) {
            return x.error === error;
          });
          if (index === -1) {
            return;
          }
          this.errors.splice(index, 1);
          this.value = this.errors;
        };

        ValidationErrorsCustomAttribute.prototype.bind = function bind() {
          this.controllerAccessor().addRenderer(this);
          this.value = this.errors;
        };

        ValidationErrorsCustomAttribute.prototype.unbind = function unbind() {
          this.controllerAccessor().removeRenderer(this);
        };

        return ValidationErrorsCustomAttribute;
      }()) || _class) || _class) || _class));

      _export('ValidationErrorsCustomAttribute', ValidationErrorsCustomAttribute);
    }
  };
});