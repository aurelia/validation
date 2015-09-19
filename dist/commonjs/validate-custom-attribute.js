'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var ValidateCustomAttribute = (function () {
  function ValidateCustomAttribute(element) {
    _classCallCheck(this, _ValidateCustomAttribute);

    this.element = element;
    this.processedValidation = null;
    this.viewStrategy = null;
  }

  var _ValidateCustomAttribute = ValidateCustomAttribute;

  _ValidateCustomAttribute.prototype.valueChanged = function valueChanged(newValue) {
    if (this.value === null || this.value === undefined) {
      return;
    }
    this.processedValidation = this.value;
    if (typeof this.value !== 'string') {
      this.subscribeChangedHandlers(this.element);
    }
    return;
  };

  _ValidateCustomAttribute.prototype.subscribeChangedHandlers = function subscribeChangedHandlers(currentElement) {
    var _this = this;

    var viewStrategy = this.value.config.getViewStrategy();
    var validationProperty = viewStrategy.getValidationProperty(this.value, currentElement);
    var children = currentElement.children;
    this.viewStrategy = viewStrategy;
    if (validationProperty !== null && validationProperty !== undefined) {
      this.viewStrategy.prepareElement(validationProperty, currentElement);
      validationProperty.onValidate(function (vp) {
        _this.viewStrategy.updateElement(vp, currentElement);
      });
    }
    for (var i = 0; i < children.length; i++) {
      this.subscribeChangedHandlers(children[i]);
    }
  };

  _ValidateCustomAttribute.prototype.attached = function attached() {
    if (this.processedValidation === null || this.processedValidation === undefined) {
      this.valueChanged(this.value);
    }
  };

  ValidateCustomAttribute = _aureliaDependencyInjection.inject(Element)(ValidateCustomAttribute) || ValidateCustomAttribute;
  ValidateCustomAttribute = _aureliaTemplating.customAttribute('validate')(ValidateCustomAttribute) || ValidateCustomAttribute;
  return ValidateCustomAttribute;
})();

exports.ValidateCustomAttribute = ValidateCustomAttribute;