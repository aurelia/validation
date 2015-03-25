"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Behavior = require("aurelia-templating").Behavior;

var ObserverLocator = require("aurelia-binding").ObserverLocator;

var ValidateAttachedBehaviorConfig = require("../validation/validateAttachedBehaviorConfig").ValidateAttachedBehaviorConfig;

var ValidateAttachedBehavior = exports.ValidateAttachedBehavior = (function () {
  function ValidateAttachedBehavior(element, observerLocator, config) {
    _classCallCheck(this, ValidateAttachedBehavior);

    this.element = element;
    this.observerLocator = observerLocator;
    this.changedObservers = [];
    this.config = config;
  }

  _createClass(ValidateAttachedBehavior, {
    valueChanged: {
      value: function valueChanged(newValue) {
        if (this.value === null || this.value === undefined) {
          return;
        }if (typeof this.value === "string") {
          return; //this is just to tell the real validation instance (higher in the DOM) the exact property-path to bind to
        } else if (this.value.constructor.name === "ValidationResultProperty") {
          //Binding to a single validation property
          this.subscribeChangedHandlersForProperty(this.value, this.element);
        } else {
          //binding to a validation instance
          this.subscribeChangedHandlers(this.element);
        }
      }
    },
    searchFormGroup: {
      value: function searchFormGroup(currentElement, currentDepth) {
        if (currentDepth === 5) {
          return null;
        }
        if (currentElement.classList.contains("form-group")) {
          return currentElement;
        }
        return this.searchFormGroup(currentElement.parentNode, 1 + currentDepth);
      }
    },
    findLabels: {
      value: function findLabels(formGroup, inputId) {
        var labels = [];
        this.findLabelsRecursively(formGroup, inputId, labels, 0);
        return labels;
      }
    },
    findLabelsRecursively: {
      value: function findLabelsRecursively(currentElement, inputId, currentLabels, currentDepth) {
        if (currentDepth === 5) {
          return;
        }
        if (currentElement.nodeName === "LABEL" && (currentElement.attributes["for"] && currentElement.attributes["for"].value === inputId || !currentElement.attributes["for"])) {
          currentLabels.push(currentElement);
        }

        for (var i = 0; i < currentElement.children.length; i++) {
          this.findLabelsRecursively(currentElement.children[i], inputId, currentLabels, 1 + currentDepth);
        }
      }
    },
    subscribeChangedHandlersForAttribute: {
      value: function subscribeChangedHandlersForAttribute(currentElement, attributeName) {

        var atts = currentElement.attributes;
        if (atts[attributeName]) {
          var bindingValue = atts[attributeName].value;
          var validationProperty = this.value.result.properties[bindingValue];
          this.subscribeChangedHandlersForProperty(validationProperty, currentElement);
          return true;
        }
        return false;
      }
    },
    subscribeChangedHandlers: {
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
    },
    appendMessageToElement: {
      value: function appendMessageToElement(element, validationProperty) {
        var helpBlock = element.nextSibling;
        if (helpBlock) {
          if (!helpBlock.classList) {
            helpBlock = null;
          } else if (!helpBlock.classList.contains("aurelia-validation-message")) {
            helpBlock = null;
          }
        }

        if (!helpBlock) {
          helpBlock = document.createElement("p");
          helpBlock.classList.add("help-block");
          helpBlock.classList.add("aurelia-validation-message");

          if (element.nextSibling) {
            element.parentNode.insertBefore(helpBlock, element.nextSibling);
          } else {
            element.parentNode.appendChild(helpBlock);
          }
        }
        if (validationProperty) helpBlock.textContent = validationProperty.message;else helpBlock.textContent = "";
      }
    },
    appendUIVisuals: {
      value: function appendUIVisuals(validationProperty, currentElement) {
        var formGroup = this.searchFormGroup(currentElement, 0);
        if (formGroup) {
          if (validationProperty) {
            if (validationProperty.isValid) {
              formGroup.classList.remove("has-warning");
              formGroup.classList.add("has-success");
            } else {
              formGroup.classList.remove("has-success");
              formGroup.classList.add("has-warning");
            }
          } else {
            formGroup.classList.remove("has-warning");
            formGroup.classList.remove("has-success");
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
    },
    subscribeChangedHandlersForProperty: {
      value: function subscribeChangedHandlersForProperty(validationProperty, currentElement) {
        var _this = this;

        if (validationProperty !== undefined) {
          this.appendUIVisuals(null, currentElement);
          validationProperty.onValidate(function (validationProperty) {
            _this.appendUIVisuals(validationProperty, currentElement);
          });
        }
      }
    },
    detached: {
      value: function detached() {}
    },
    attached: {
      value: function attached() {}
    }
  }, {
    metadata: {
      value: function metadata() {
        return Behavior.attachedBehavior("validate");
      }
    },
    inject: {
      value: function inject() {
        return [Element, ObserverLocator, ValidateAttachedBehaviorConfig];
      }
    }
  });

  return ValidateAttachedBehavior;
})();