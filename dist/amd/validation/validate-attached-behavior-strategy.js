define(['exports'], function (exports) {
  'use strict';

  var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var ValidateAttachedBehaviorViewStrategyBase = (function () {
    function ValidateAttachedBehaviorViewStrategyBase() {
      _classCallCheck(this, ValidateAttachedBehaviorViewStrategyBase);

      this.bindingPathAttributes = ['validate', 'value.bind', 'value.two-way'];
    }

    _createClass(ValidateAttachedBehaviorViewStrategyBase, [{
      key: 'getValidationProperty',
      value: function getValidationProperty(validation, element) {
        var atts = element.attributes;
        for (var i = 0; i < this.bindingPathAttributes.length; i++) {
          var attributeName = this.bindingPathAttributes[i];
          if (atts[attributeName]) {
            var bindingPath = atts[attributeName].value.trim();
            if (bindingPath.indexOf('|') != -1) bindingPath = bindingPath.split('|')[0].trim();
            var validationProperty = validation.result.properties[bindingPath];

            if (attributeName == 'validate' && (validationProperty === null || validationProperty === undefined)) {
              validation.ensure(bindingPath);
              validationProperty = validation.result.properties[bindingPath];
            }
            return validationProperty;
          }
        }
        return null;
      }
    }, {
      key: 'prepareElement',
      value: function prepareElement(validationProperty, element) {
        throw Error('View strategy must implement prepareElement(validationProperty, element)');
      }
    }, {
      key: 'updateElement',
      value: function updateElement(validationProperty, element) {
        throw Error('View strategy must implement updateElement(validationProperty, element)');
      }
    }]);

    return ValidateAttachedBehaviorViewStrategyBase;
  })();

  exports.ValidateAttachedBehaviorViewStrategyBase = ValidateAttachedBehaviorViewStrategyBase;

  var TWBootstrapViewStrategy = (function (_ValidateAttachedBehaviorViewStrategyBase) {
    function TWBootstrapViewStrategy(appendMessageToInput, appendMessageToLabel, helpBlockClass) {
      _classCallCheck(this, TWBootstrapViewStrategy);

      _get(Object.getPrototypeOf(TWBootstrapViewStrategy.prototype), 'constructor', this).call(this);
      this.appendMessageToInput = appendMessageToInput;
      this.appendMessageToLabel = appendMessageToLabel;
      this.helpBlockClass = helpBlockClass;
    }

    _inherits(TWBootstrapViewStrategy, _ValidateAttachedBehaviorViewStrategyBase);

    _createClass(TWBootstrapViewStrategy, [{
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
      key: 'appendMessageToElement',
      value: function appendMessageToElement(element, validationProperty) {
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
        }
      }
    }, {
      key: 'prepareElement',
      value: function prepareElement(validationProperty, element) {
        this.appendUIVisuals(null, element);
      }
    }, {
      key: 'updateElement',
      value: function updateElement(validationProperty, element) {
        this.appendUIVisuals(validationProperty, element);
      }
    }]);

    return TWBootstrapViewStrategy;
  })(ValidateAttachedBehaviorViewStrategyBase);

  exports.TWBootstrapViewStrategy = TWBootstrapViewStrategy;

  var ValidateAttachedBehaviorStrategy = function ValidateAttachedBehaviorStrategy() {
    _classCallCheck(this, ValidateAttachedBehaviorStrategy);
  };

  exports.ValidateAttachedBehaviorStrategy = ValidateAttachedBehaviorStrategy;

  ValidateAttachedBehaviorStrategy.TWBootstrapAppendToInput = new TWBootstrapViewStrategy(true, false, 'aurelia-validation-message');
  ValidateAttachedBehaviorStrategy.TWBootstrapAppendToMessage = new TWBootstrapViewStrategy(false, true, 'aurelia-validation-message');
});