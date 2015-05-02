System.register(['aurelia-dependency-injection', 'aurelia-templating'], function (_export) {
  var inject, customAttribute, Behavior, _classCallCheck, ValidateCustomAttribute;

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
      Behavior = _aureliaTemplating.Behavior;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      ValidateCustomAttribute = (function () {
        function ValidateCustomAttribute(element) {
          _classCallCheck(this, _ValidateCustomAttribute);

          this.element = element;
          this.processedValidation = null;
          this.viewStrategy = null;
        }

        ValidateCustomAttribute.prototype.valueChanged = function valueChanged(newValue) {
          if (this.value === null || this.value === undefined) {
            return;
          }this.processedValidation = this.value;
          if (typeof this.value === 'string') {
            return;
          } else {
            this.subscribeChangedHandlers(this.element);
          }
        };

        ValidateCustomAttribute.prototype.subscribeChangedHandlers = function subscribeChangedHandlers(currentElement) {
          var _this = this;

          this.viewStrategy = this.value.config.getViewStrategy();
          var validationProperty = this.viewStrategy.getValidationProperty(this.value, currentElement);
          if (validationProperty !== null && validationProperty !== undefined) {
            this.viewStrategy.prepareElement(validationProperty, currentElement);
            validationProperty.onValidate(function (vp) {
              _this.viewStrategy.updateElement(vp, currentElement);
            });
          }
          var children = currentElement.children;
          for (var i = 0; i < children.length; i++) {
            this.subscribeChangedHandlers(children[i]);
          }
        };

        ValidateCustomAttribute.prototype.detached = function detached() {};

        ValidateCustomAttribute.prototype.attached = function attached() {
          if (this.processedValidation === null || this.processedValidation === undefined) this.valueChanged(this.value);
        };

        var _ValidateCustomAttribute = ValidateCustomAttribute;
        ValidateCustomAttribute = customAttribute('validate')(ValidateCustomAttribute) || ValidateCustomAttribute;
        ValidateCustomAttribute = inject(Element)(ValidateCustomAttribute) || ValidateCustomAttribute;
        return ValidateCustomAttribute;
      })();

      _export('ValidateCustomAttribute', ValidateCustomAttribute);
    }
  };
});