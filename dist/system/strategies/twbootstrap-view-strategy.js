System.register(['../validation-view-strategy'], function (_export) {
  'use strict';

  var ValidationViewStrategy, TWBootstrapViewStrategyBase, TWBootstrapViewStrategy;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  return {
    setters: [function (_validationViewStrategy) {
      ValidationViewStrategy = _validationViewStrategy.ValidationViewStrategy;
    }],
    execute: function () {
      TWBootstrapViewStrategyBase = (function (_ValidationViewStrategy) {
        function TWBootstrapViewStrategyBase(appendMessageToInput, appendMessageToLabel, helpBlockClass) {
          _classCallCheck(this, TWBootstrapViewStrategyBase);

          _ValidationViewStrategy.call(this);
          this.appendMessageToInput = appendMessageToInput;
          this.appendMessageToLabel = appendMessageToLabel;
          this.helpBlockClass = helpBlockClass;
        }

        _inherits(TWBootstrapViewStrategyBase, _ValidationViewStrategy);

        TWBootstrapViewStrategyBase.prototype.searchFormGroup = function searchFormGroup(currentElement, currentDepth) {
          if (currentDepth === 5) {
            return null;
          }

          if (currentElement.classList && currentElement.classList.contains('form-group')) {
            return currentElement;
          }

          return this.searchFormGroup(currentElement.parentNode, 1 + currentDepth);
        };

        TWBootstrapViewStrategyBase.prototype.findLabels = function findLabels(formGroup, inputId) {
          var labels = [];
          this.findLabelsRecursively(formGroup, inputId, labels, 0);
          return labels;
        };

        TWBootstrapViewStrategyBase.prototype.findLabelsRecursively = function findLabelsRecursively(currentElement, inputId, currentLabels, currentDepth) {
          if (currentDepth === 5) {
            return;
          }
          if (currentElement.nodeName === 'LABEL' && (currentElement.attributes['for'] && currentElement.attributes['for'].value === inputId || !currentElement.attributes['for'])) {
            currentLabels.push(currentElement);
          }
          for (var i = 0; i < currentElement.children.length; i++) {
            this.findLabelsRecursively(currentElement.children[i], inputId, currentLabels, 1 + currentDepth);
          }
        };

        TWBootstrapViewStrategyBase.prototype.appendMessageToElement = function appendMessageToElement(element, validationProperty) {
          var helpBlock = element.nextSibling;
          if (helpBlock) {
            if (!helpBlock.classList) {
              helpBlock = null;
            } else if (!helpBlock.classList.contains(this.helpBlockClass)) {
              helpBlock = null;
            }
          }

          if (!helpBlock) {
            helpBlock = document.createElement('p');
            helpBlock.classList.add('help-block');
            helpBlock.classList.add(this.helpBlockClass);
            if (element.nextSibling) {
              element.parentNode.insertBefore(helpBlock, element.nextSibling);
            } else {
              element.parentNode.appendChild(helpBlock);
            }
          }

          helpBlock.textContent = validationProperty ? validationProperty.message : '';
        };

        TWBootstrapViewStrategyBase.prototype.appendUIVisuals = function appendUIVisuals(validationProperty, currentElement) {
          var formGroup = this.searchFormGroup(currentElement, 0);
          if (formGroup === null) {
            return;
          }

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

          if (this.appendMessageToInput) {
            this.appendMessageToElement(currentElement, validationProperty);
          }

          if (this.appendMessageToLabel) {
            var labels = this.findLabels(formGroup, currentElement.id);
            for (var ii = 0; ii < labels.length; ii++) {
              var label = labels[ii];
              this.appendMessageToElement(label, validationProperty);
            }
          }
        };

        TWBootstrapViewStrategyBase.prototype.prepareElement = function prepareElement(validationProperty, element) {
          this.appendUIVisuals(null, element);
        };

        TWBootstrapViewStrategyBase.prototype.updateElement = function updateElement(validationProperty, element) {
          this.appendUIVisuals(validationProperty, element);
        };

        return TWBootstrapViewStrategyBase;
      })(ValidationViewStrategy);

      _export('TWBootstrapViewStrategyBase', TWBootstrapViewStrategyBase);

      TWBootstrapViewStrategy = function TWBootstrapViewStrategy() {
        _classCallCheck(this, TWBootstrapViewStrategy);
      };

      _export('TWBootstrapViewStrategy', TWBootstrapViewStrategy);

      TWBootstrapViewStrategy.AppendToInput = new TWBootstrapViewStrategyBase(true, false, 'aurelia-validation-message');
      TWBootstrapViewStrategy.AppendToMessage = new TWBootstrapViewStrategyBase(false, true, 'aurelia-validation-message');
    }
  };
});