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
    //This empty method must be here, aurelia will not set this.value if it's not :-O
  }

  attached() {
    if (this.value === null || this.value === undefined)
      throw 'Cannot bind ValidateAttachedBehavior to null/undefined';
    if (typeof (this.value) === 'string') {
      return; //this is just to tell the real validation instance (higher in the DOM) the exact property to bind to
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
      currentElement.attributes['for'] &&
      currentElement.attributes['for'].value === inputId) {
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

    helpBlock.textContent = validationProperty.message;
  }

  subscribeChangedHandlersForProperty(validationProperty, currentElement) {
    if (validationProperty !== undefined) {
      validationProperty.onValidate(
        (validationProperty) => {
          var formGroup = this.searchFormGroup(currentElement, 0);
          if (formGroup) {
            if (validationProperty.isValid) {
              formGroup.classList.remove('has-warning');
              formGroup.classList.add('has-success');
            }
            else {
              formGroup.classList.remove('has-success');
              formGroup.classList.add('has-warning');
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
      );
    }
  }

  detached() {
  }
}
