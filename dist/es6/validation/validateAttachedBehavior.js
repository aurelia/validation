import {Behavior} from 'aurelia-templating';
import {ObserverLocator} from 'aurelia-binding';
import {ValidateAttachedBehaviorConfig} from '../validation/validateAttachedBehaviorConfig'

export class ValidateAttachedBehavior {
  static metadata() {
    return Behavior
      .attachedBehavior('validate');
  }

  static inject() {
    return [Element, ObserverLocator, ValidateAttachedBehaviorConfig];
  }

  constructor(element, observerLocator, config) {
    this.element = element;
    this.observerLocator = observerLocator;
    this.changedObservers = [];
    this.config = config;
  }

  valueChanged(newValue) {
    if (this.value === null || this.value === undefined)
      return;
    if (typeof (this.value) === 'string') {
      return; //this is just to tell the real validation instance (higher in the DOM) the exact property-path to bind to
    }
    else if (this.value.constructor.name === 'ValidationResultProperty') {
      //Binding to a single validation property
      this.subscribeChangedHandlersForProperty(this.value, this.element);
    }
    else {
      //binding to a validation instance
      this.subscribeChangedHandlers(this.element);
    }
  }


  searchFormGroup(currentElement, currentDepth) {
    if (currentDepth === 5) {
      return null;
    }
    if (currentElement.classList.contains('form-group')) {
      return currentElement;
    }
    return this.searchFormGroup(currentElement.parentNode, 1 + currentDepth);
  }


  findLabels(formGroup, inputId) {
    var labels = [];
    this.findLabelsRecursively(formGroup, inputId, labels, 0);
    return labels;
  }

  findLabelsRecursively(currentElement, inputId, currentLabels, currentDepth) {
    if (currentDepth === 5) {
      return;
    }
    if (currentElement.nodeName === "LABEL" &&
      ((currentElement.attributes['for'] && currentElement.attributes['for'].value === inputId) ||
      (!currentElement.attributes['for']))
    )
      {
      currentLabels.push(currentElement);
    }


    for (let i = 0; i < currentElement.children.length; i++)
      this.findLabelsRecursively(currentElement.children[i], inputId, currentLabels, 1 + currentDepth);
  }

  subscribeChangedHandlersForAttribute(currentElement, attributeName) {

    var atts = currentElement.attributes;
    if (atts[attributeName]) {
      var bindingValue = atts[attributeName].value;
      var validationProperty = this.value.result.properties[bindingValue];
      this.subscribeChangedHandlersForProperty(validationProperty, currentElement);
      return true;
    }
    return false;
  }

  subscribeChangedHandlers(currentElement) {
    for (let i = 0; i < this.config.bindingPathAttributes.length; i++) {
      if (this.subscribeChangedHandlersForAttribute(currentElement, this.config.bindingPathAttributes[i])) {
        break;
      }
    }
    var children = currentElement.children;
    for (var i = 0; i < children.length; i++) {
      this.subscribeChangedHandlers(children[i]);
    }
  }


  appendMessageToElement(element, validationProperty) {
    var helpBlock = element.nextSibling;
    if (helpBlock) {
      if (!helpBlock.classList) {
        helpBlock = null;
      }
      else if (!helpBlock.classList.contains('aurelia-validation-message')) {
        helpBlock = null;
      }
    }

    if (!helpBlock) {
      helpBlock = document.createElement("p");
      helpBlock.classList.add('help-block');
      helpBlock.classList.add('aurelia-validation-message');

      if (element.nextSibling) {
        element.parentNode.insertBefore(helpBlock, element.nextSibling);
      }
      else {
        element.parentNode.appendChild(helpBlock);
      }
    }
    if(validationProperty)
      helpBlock.textContent = validationProperty.message;
    else
      helpBlock.textContent = '';
  }

  appendUIVisuals(validationProperty, currentElement)
  {
    var formGroup = this.searchFormGroup(currentElement, 0);
    if (formGroup) {
      if(validationProperty) {
        if (validationProperty.isValid) {
          formGroup.classList.remove('has-warning');
          formGroup.classList.add('has-success');
        }
        else {
          formGroup.classList.remove('has-success');
          formGroup.classList.add('has-warning');
        }
      }
      else{
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

  subscribeChangedHandlersForProperty(validationProperty, currentElement) {
    if (validationProperty !== undefined) {
      this.appendUIVisuals(null, currentElement);
      validationProperty.onValidate(
        (validationProperty) => {
          this.appendUIVisuals(validationProperty, currentElement);
        }
      );
    }
  }

  detached() {
  }

  attached() {
  }
}
