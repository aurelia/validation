import {ValidationViewStrategy} from '../validation-view-strategy';

export class TWBootstrapViewStrategyBase extends ValidationViewStrategy {
  appendMessageToInput: boolean;
  appendMessageToLabel: boolean;
  helpBlockClass: string;
  formGroupClass: string;
  validationMsgTagName: string;

  constructor(appendMessageToInput: boolean, appendMessageToLabel: boolean, helpBlockClass: string, formGroupClass = "form-group", validationMsgTagName = "p") {
    super();
    this.appendMessageToInput = appendMessageToInput;
    this.appendMessageToLabel = appendMessageToLabel;
    this.helpBlockClass = helpBlockClass;
    this.formGroupClass = formGroupClass;
    this.validationMsgTagName = validationMsgTagName;
  }

  searchFormGroup(currentElement, currentDepth) {
    if (currentDepth === 5) {
      return null;
    }

    if (currentElement.classList && currentElement.classList.contains(this.formGroupClass)) {
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
    let helpBlock = this.findExistingHelpBlock(element);

    if (!helpBlock) {
      helpBlock = document.createElement(this.validationMsgTagName);
      helpBlock.classList.add('help-block');
      helpBlock.classList.add(this.helpBlockClass);
      this.addHelpBlockToElement(element, helpBlock);
    }

    helpBlock.textContent = validationProperty ? validationProperty.message : '';
  }

  findExistingHelpBlock(element: Element) {
    var helpBlock = element.nextSibling;
    if (helpBlock) {
      if (!helpBlock.classList) {
        return null;
      }
      else if (!helpBlock.classList.contains(this.helpBlockClass)) {
        return null;
      }
    }
    return helpBlock;
  }

  addHelpBlockToElement(element: Element, helpBlock: Element) {
    if (element.nextSibling) {
      element.parentNode.insertBefore(helpBlock, element.nextSibling);
    } else {
      element.parentNode.appendChild(helpBlock);
    }
  }

  appendUIVisuals(validationProperty, currentElement) {
    let formGroup = this.searchFormGroup(currentElement, 0);
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
