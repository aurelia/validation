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
      }
    },
    attached: {
      value: function attached() {
        if (this.value === null || this.value === undefined) throw "Cannot bind ValidateAttachedBehavior to null/undefined";
        if (typeof this.value === "string") {
          return; //this is just to tell the real validation instance (higher in the DOM) the exact property to bind to
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
        if (currentElement.nodeName === "LABEL" && currentElement.attributes["for"] && currentElement.attributes["for"].value === inputId) {
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

        helpBlock.textContent = validationProperty.message;
      }
    },
    subscribeChangedHandlersForProperty: {
      value: function subscribeChangedHandlersForProperty(validationProperty, currentElement) {
        var _this = this;

        if (validationProperty !== undefined) {
          validationProperty.onValidate(function (validationProperty) {
            var formGroup = _this.searchFormGroup(currentElement, 0);
            if (formGroup) {
              if (validationProperty.isValid) {
                formGroup.classList.remove("has-warning");
                formGroup.classList.add("has-success");
              } else {
                formGroup.classList.remove("has-success");
                formGroup.classList.add("has-warning");
              }
              if (_this.config.appendMessageToInput) {
                _this.appendMessageToElement(currentElement, validationProperty);
              }
              if (_this.config.appendMessageToLabel) {
                var labels = _this.findLabels(formGroup, currentElement.id);
                for (var ii = 0; ii < labels.length; ii++) {
                  var label = labels[ii];
                  _this.appendMessageToElement(label, validationProperty);
                }
              }
            }
          });
        }
      }
    },
    detached: {
      value: function detached() {
      }
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

//This empty method must be here, aurelia will not set this.value if it's not :-O
