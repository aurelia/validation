'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidateCustomAttribute = undefined;

var _dec, _dec2, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidateCustomAttribute = exports.ValidateCustomAttribute = (_dec = (0, _aureliaTemplating.customAttribute)('validate'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec(_class = _dec2(_class = function () {
  function ValidateCustomAttribute(element) {
    _classCallCheck(this, ValidateCustomAttribute);

    this.element = element;
    this.processedValidation = null;
    this.viewStrategy = null;
  }

  ValidateCustomAttribute.prototype.valueChanged = function valueChanged(newValue) {
    if (this.value === null || this.value === undefined) {
      return;
    }
    this.processedValidation = this.value;
    if (typeof this.value !== 'string') {
      this.subscribeChangedHandlers(this.element);
    }
    return;
  };

  ValidateCustomAttribute.prototype.subscribeChangedHandlers = function subscribeChangedHandlers(currentElement) {
    var _this = this;

    var viewStrategy = this.value.config.getViewStrategy();
    var validationProperty = viewStrategy.getValidationProperty(this.value, currentElement);
    var children = currentElement.children || currentElement.childNodes;
    this.viewStrategy = viewStrategy;
    if (validationProperty !== null && validationProperty !== undefined) {
      this.viewStrategy.prepareElement(validationProperty, currentElement);
      validationProperty.onValidate(function (vp) {
        _this.viewStrategy.updateElement(vp, currentElement);
      });
    }
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeType == 3) continue;
      this.subscribeChangedHandlers(children[i]);
    }
  };

  ValidateCustomAttribute.prototype.attached = function attached() {
    if (this.processedValidation === null || this.processedValidation === undefined) {
      this.valueChanged(this.value);
    }
  };

  return ValidateCustomAttribute;
}()) || _class) || _class);