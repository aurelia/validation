'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationErrorsCustomAttribute = undefined;

var _dec, _dec2, _class;

var _aureliaBinding = require('aurelia-binding');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _validationController = require('./validation-controller');

var _validationRenderer = require('./validation-renderer');



var ValidationErrorsCustomAttribute = exports.ValidationErrorsCustomAttribute = (_dec = (0, _aureliaTemplating.customAttribute)('validation-errors', _aureliaBinding.bindingMode.twoWay), _dec2 = (0, _aureliaDependencyInjection.inject)(Element, _aureliaDependencyInjection.Lazy.of(_validationController.ValidationController)), _dec(_class = _dec2(_class = (0, _validationRenderer.validationRenderer)(_class = function () {
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
    if (!target || !(this.boundaryElement === target || this.boundaryElement.contains(target))) {
      return;
    }

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
}()) || _class) || _class) || _class);