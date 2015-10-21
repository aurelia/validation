import {ValidationViewStrategy} from '../validation-view-strategy';
import * as TheLogManager from 'aurelia-logging';

export class TWBootstrapViewStrategyBase extends ValidationViewStrategy {
  constructor(appendMessageToInput, appendMessageToLabel, helpBlockClass) {
    super();
    this.appendMessageToInput = appendMessageToInput;
    this.appendMessageToLabel = appendMessageToLabel;
    this.helpBlockClass = helpBlockClass;
    this.logger = TheLogManager.getLogger('validation');
  }

  searchFormGroup(currentElement, currentDepth) {
    if (currentDepth === 5 || !currentElement) {
      return null;
    }

    if (currentElement.classList && currentElement.classList.contains('form-group')) {
      return currentElement;
    }

    return this.searchFormGroup(currentElement.parentNode, 1 + currentDepth);
  }

  findLabels(formGroup, inputId) {
    let labels = [];
    this.findLabelsRecursively(formGroup, inputId, labels, 0);
    return labels;
  }

  findLabelsRecursively(currentElement, inputId, currentLabels, currentDepth) {
    if (currentDepth === 5) {
      return;
    }
    if (currentElement.nodeName === 'LABEL' &&
      ((currentElement.attributes.for && currentElement.attributes.for.value === inputId) ||
      (!currentElement.attributes.for))
    ) {
      currentLabels.push(currentElement);
    }
    for (let i = 0; i < currentElement.children.length; i++) {
      this.findLabelsRecursively(currentElement.children[i], inputId, currentLabels, 1 + currentDepth);
    }
  }

  appendMessageToElement(element, validationProperty) {
    let helpBlock = element.nextSibling;
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
  }

  appendUIVisuals(validationProperty, currentElement) {
    let formGroup = this.searchFormGroup(currentElement, 0);
    if (formGroup === null) {
      this.logger.warn("Didn't find formGroup - can't show validation message for element:", currentElement);
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
      let labels = this.findLabels(formGroup, currentElement.id);
      for (let ii = 0; ii < labels.length; ii++) {
        let label = labels[ii];
        this.appendMessageToElement(label, validationProperty);
      }
    }
  }

  prepareElement(validationProperty, element) {
    this.appendUIVisuals(null, element);
  }

  updateElement(validationProperty, element) {
    this.appendUIVisuals(validationProperty, element);
  }
}

export class TWBootstrapViewStrategy { }
TWBootstrapViewStrategy.AppendToInput =
  new TWBootstrapViewStrategyBase(true, false, 'aurelia-validation-message');
TWBootstrapViewStrategy.AppendToMessage =
  new TWBootstrapViewStrategyBase(false, true, 'aurelia-validation-message');

