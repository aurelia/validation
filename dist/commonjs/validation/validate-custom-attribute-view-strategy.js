'use strict';

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var ValidateCustomAttributeViewStrategyBase = (function () {
  function ValidateCustomAttributeViewStrategyBase() {
    _classCallCheck(this, ValidateCustomAttributeViewStrategyBase);

    this.bindingPathAttributes = ['validate', 'value.bind', 'value.two-way'];
  }

  ValidateCustomAttributeViewStrategyBase.prototype.getValidationProperty = function getValidationProperty(validation, element) {
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
  };

  ValidateCustomAttributeViewStrategyBase.prototype.prepareElement = function prepareElement(validationProperty, element) {
    throw Error('View strategy must implement prepareElement(validationProperty, element)');
  };

  ValidateCustomAttributeViewStrategyBase.prototype.updateElement = function updateElement(validationProperty, element) {
    throw Error('View strategy must implement updateElement(validationProperty, element)');
  };

  return ValidateCustomAttributeViewStrategyBase;
})();

exports.ValidateCustomAttributeViewStrategyBase = ValidateCustomAttributeViewStrategyBase;

var TWBootstrapViewStrategy = (function (_ValidateCustomAttributeViewStrategyBase) {
  function TWBootstrapViewStrategy(appendMessageToInput, appendMessageToLabel, helpBlockClass) {
    _classCallCheck(this, TWBootstrapViewStrategy);

    _ValidateCustomAttributeViewStrategyBase.call(this);
    this.appendMessageToInput = appendMessageToInput;
    this.appendMessageToLabel = appendMessageToLabel;
    this.helpBlockClass = helpBlockClass;
  }

  _inherits(TWBootstrapViewStrategy, _ValidateCustomAttributeViewStrategyBase);

  TWBootstrapViewStrategy.prototype.searchFormGroup = function searchFormGroup(currentElement, currentDepth) {
    if (currentDepth === 5) {
      return null;
    }
    if (currentElement.classList && currentElement.classList.contains('form-group')) {
      return currentElement;
    }
    return this.searchFormGroup(currentElement.parentNode, 1 + currentDepth);
  };

  TWBootstrapViewStrategy.prototype.findLabels = function findLabels(formGroup, inputId) {
    var labels = [];
    this.findLabelsRecursively(formGroup, inputId, labels, 0);
    return labels;
  };

  TWBootstrapViewStrategy.prototype.findLabelsRecursively = function findLabelsRecursively(currentElement, inputId, currentLabels, currentDepth) {
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

  TWBootstrapViewStrategy.prototype.appendMessageToElement = function appendMessageToElement(element, validationProperty) {
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
  };

  TWBootstrapViewStrategy.prototype.appendUIVisuals = function appendUIVisuals(validationProperty, currentElement) {
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
  };

  TWBootstrapViewStrategy.prototype.prepareElement = function prepareElement(validationProperty, element) {
    this.appendUIVisuals(null, element);
  };

  TWBootstrapViewStrategy.prototype.updateElement = function updateElement(validationProperty, element) {
    this.appendUIVisuals(validationProperty, element);
  };

  return TWBootstrapViewStrategy;
})(ValidateCustomAttributeViewStrategyBase);

exports.TWBootstrapViewStrategy = TWBootstrapViewStrategy;

var ValidateCustomAttributeViewStrategy = function ValidateCustomAttributeViewStrategy() {
  _classCallCheck(this, ValidateCustomAttributeViewStrategy);
};

exports.ValidateCustomAttributeViewStrategy = ValidateCustomAttributeViewStrategy;

ValidateCustomAttributeViewStrategy.TWBootstrapAppendToInput = new TWBootstrapViewStrategy(true, false, 'aurelia-validation-message');
ValidateCustomAttributeViewStrategy.TWBootstrapAppendToMessage = new TWBootstrapViewStrategy(false, true, 'aurelia-validation-message');