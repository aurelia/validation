'use strict';

System.register(['aurelia-dependency-injection', 'aurelia-templating'], function (_export, _context) {
  var inject, customAttribute, _dec, _dec2, _class, ValidateCustomAttribute;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
    }],
    execute: function () {
      _export('ValidateCustomAttribute', ValidateCustomAttribute = (_dec = customAttribute('validate'), _dec2 = inject(Element), _dec(_class = _dec2(_class = function () {
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

        ValidateCustomAttribute.prototype.attached = function attached() {
          if (this.processedValidation === null || this.processedValidation === undefined) {
            this.valueChanged(this.value);
          }
        };

        return ValidateCustomAttribute;
      }()) || _class) || _class));

      _export('ValidateCustomAttribute', ValidateCustomAttribute);
    }
  };
});