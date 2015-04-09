System.register(['aurelia-dependency-injection', 'aurelia-templating', 'aurelia-binding', '../validation/validate-attached-behavior-config'], function (_export) {
  var inject, customAttribute, Behavior, ObserverLocator, ValidateAttachedBehaviorConfig, _classCallCheck, _createClass, ValidateAttachedBehavior;

  return {
    setters: [function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_aureliaTemplating) {
      customAttribute = _aureliaTemplating.customAttribute;
      Behavior = _aureliaTemplating.Behavior;
    }, function (_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
    }, function (_validationValidateAttachedBehaviorConfig) {
      ValidateAttachedBehaviorConfig = _validationValidateAttachedBehaviorConfig.ValidateAttachedBehaviorConfig;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      ValidateAttachedBehavior = (function () {
        function ValidateAttachedBehavior(element, observerLocator, config) {
          _classCallCheck(this, _ValidateAttachedBehavior);

          this.element = element;
          this.observerLocator = observerLocator;
          this.changedObservers = [];
          this.config = config;
          this.processedValidation = null;
        }

        _createClass(ValidateAttachedBehavior, [{
          key: 'valueChanged',
          value: function valueChanged(newValue) {
            if (this.value === null || this.value === undefined) {
              return;
            }this.processedValidation = this.value;
            if (typeof this.value === 'string') {
              return;
            } else if (this.value.constructor.name === 'ValidationResultProperty') {
              this.subscribeChangedHandlersForProperty(this.value, this.element);
            } else {
              this.subscribeChangedHandlers(this.element);
            }
          }
        }, {
          key: 'searchFormGroup',
          value: function searchFormGroup(currentElement, currentDepth) {
            if (currentDepth === 5) {
              return null;
            }
            if (currentElement.classList && currentElement.classList.contains('form-group')) {
              return currentElement;
            }
            return this.searchFormGroup(currentElement.parentNode, 1 + currentDepth);
          }
        }, {
          key: 'findLabels',
          value: function findLabels(formGroup, inputId) {
            var labels = [];
            this.findLabelsRecursively(formGroup, inputId, labels, 0);
            return labels;
          }
        }, {
          key: 'findLabelsRecursively',
          value: function findLabelsRecursively(currentElement, inputId, currentLabels, currentDepth) {
            if (currentDepth === 5) {
              return;
            }
            if (currentElement.nodeName === 'LABEL' && (currentElement.attributes['for'] && currentElement.attributes['for'].value === inputId || !currentElement.attributes['for'])) {
              currentLabels.push(currentElement);
            }

            for (var i = 0; i < currentElement.children.length; i++) {
              this.findLabelsRecursively(currentElement.children[i], inputId, currentLabels, 1 + currentDepth);
            }
          }
        }, {
          key: 'subscribeChangedHandlersForAttribute',
          value: function subscribeChangedHandlersForAttribute(currentElement, attributeName) {

            var atts = currentElement.attributes;
            if (atts[attributeName]) {
              var bindingPath = atts[attributeName].value.trim();
              if (bindingPath.indexOf('|') != -1) bindingPath = bindingPath.split('|')[0].trim();
              var validationProperty = this.value.result.properties[bindingPath];

              if (attributeName == 'validate' && (validationProperty === null || validationProperty === undefined)) {
                this.value.ensure(bindingPath);
                validationProperty = this.value.result.properties[bindingPath];
              }

              this.subscribeChangedHandlersForProperty(validationProperty, currentElement);
              return true;
            }
            return false;
          }
        }, {
          key: 'subscribeChangedHandlers',
          value: function subscribeChangedHandlers(currentElement) {
            for (var _i = 0; _i < this.config.bindingPathAttributes.length; _i++) {
              if (this.subscribeChangedHandlersForAttribute(currentElement, this.config.bindingPathAttributes[_i])) {
                break;
              }
            }
            var children = currentElement.children;
            for (var i = 0; i < children.length; i++) {
              this.subscribeChangedHandlers(children[i]);
            }
          }
        }, {
          key: 'appendMessageToElement',
          value: function appendMessageToElement(element, validationProperty) {
            var helpBlock = element.nextSibling;
            if (helpBlock) {
              if (!helpBlock.classList) {
                helpBlock = null;
              } else if (!helpBlock.classList.contains('aurelia-validation-message')) {
                helpBlock = null;
              }
            }

            if (!helpBlock) {
              helpBlock = document.createElement('p');
              helpBlock.classList.add('help-block');
              helpBlock.classList.add('aurelia-validation-message');

              if (element.nextSibling) {
                element.parentNode.insertBefore(helpBlock, element.nextSibling);
              } else {
                element.parentNode.appendChild(helpBlock);
              }
            }
            if (validationProperty) helpBlock.textContent = validationProperty.message;else helpBlock.textContent = '';
          }
        }, {
          key: 'appendUIVisuals',
          value: function appendUIVisuals(validationProperty, currentElement) {
            var formGroup = this.searchFormGroup(currentElement, 0);
            if (formGroup) {
              if (validationProperty && validationProperty.isDirty) {
                if (validationProperty.isValid) {
                  formGroup.classList.remove('has-warning');
                  formGroup.classList.add('has-success');
                } else {
                  formGroup.classList.remove('has-success');
                  formGroup.classList.add('has-warning');
                }
              } else {
                formGroup.classList.remove('has-warning');
                formGroup.classList.remove('has-success');
              }
              if (this.config.appendMessageToInput) {
                this.appendMessageToElement(currentElement, validationProperty);
              }
              if (this.config.appendMessageToLabel) {
                var labels = this.findLabels(formGroup, currentElement.id);
                for (var ii = 0; ii < labels.length; ii++) {
                  var label = labels[ii];
                  this.appendMessageToElement(label, validationProperty);
                }
              }
            }
          }
        }, {
          key: 'subscribeChangedHandlersForProperty',
          value: function subscribeChangedHandlersForProperty(validationProperty, currentElement) {
            var _this = this;

            if (validationProperty !== undefined) {
              this.appendUIVisuals(null, currentElement);
              validationProperty.onValidate(function (validationProperty) {
                _this.appendUIVisuals(validationProperty, currentElement);
              });
            }
          }
        }, {
          key: 'detached',
          value: function detached() {}
        }, {
          key: 'attached',
          value: function attached() {
            if (this.processedValidation === null || this.processedValidation === undefined) this.valueChanged(this.value);
          }
        }]);

        var _ValidateAttachedBehavior = ValidateAttachedBehavior;
        ValidateAttachedBehavior = customAttribute('validate')(ValidateAttachedBehavior) || ValidateAttachedBehavior;
        ValidateAttachedBehavior = inject(Element, ObserverLocator, ValidateAttachedBehaviorConfig)(ValidateAttachedBehavior) || ValidateAttachedBehavior;
        return ValidateAttachedBehavior;
      })();

      _export('ValidateAttachedBehavior', ValidateAttachedBehavior);
    }
  };
});