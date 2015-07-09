export class ValidateCustomAttributeViewStrategyBase{
  constructor(){
    this.bindingPathAttributes = ['validate', 'value.bind', 'value.two-way'];
  }

  getValidationProperty(validation, element){
    var atts = element.attributes;
    for (let i = 0; i < this.bindingPathAttributes.length; i++) {
      let attributeName = this.bindingPathAttributes[i];
      if (atts[attributeName]) {
        var bindingPath = atts[attributeName].value.trim();
        if (bindingPath.indexOf('|') != -1)
          bindingPath = bindingPath.split('|')[0].trim();
        var validationProperty = validation.result.properties[bindingPath];

        if (attributeName == 'validate' && (validationProperty === null || validationProperty === undefined)) {
          //Dev explicitly stated to show validation on a field, but there's no rules for this field
          //Hence, we add an empty validationProperty for that field, without any rules
          //This way, when 'checkAll()' is called, the input element 'turns green'
          validation.ensure(bindingPath);
          validationProperty = validation.result.properties[bindingPath];
        }
        return validationProperty;
      }
    }
    return null;
  }

  prepareElement(validationProperty, element){
    throw Error('View strategy must implement prepareElement(validationProperty, element)');
  }
  updateElement(validationProperty, element){
    throw Error('View strategy must implement updateElement(validationProperty, element)');
  }
}

export class TWBootstrapViewStrategy extends ValidateCustomAttributeViewStrategyBase {
  constructor(appendMessageToInput, appendMessageToLabel,helpBlockClass)
  {
    super();
    this.appendMessageToInput = appendMessageToInput;
    this.appendMessageToLabel = appendMessageToLabel;
    this.helpBlockClass = helpBlockClass;
  }
  searchFormGroup(currentElement, currentDepth) {
    if (currentDepth === 5) {
      return null;
    }
    if (currentElement.classList && currentElement.classList.contains('form-group')) {
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
    ) {
      currentLabels.push(currentElement);
    }


    for (let i = 0; i < currentElement.children.length; i++)
      this.findLabelsRecursively(currentElement.children[i], inputId, currentLabels, 1 + currentDepth);
  }


  appendMessageToElement(element, validationProperty) {
    var helpBlock = element.nextSibling;
    if (helpBlock) {
      if (!helpBlock.classList) {
        helpBlock = null;
      }
      else if (!helpBlock.classList.contains(this.helpBlockClass)) {
        helpBlock = null;
      }
    }

    if (!helpBlock) {
      helpBlock = document.createElement("p");
      helpBlock.classList.add('help-block');
      helpBlock.classList.add(this.helpBlockClass);

      if (element.nextSibling) {
        element.parentNode.insertBefore(helpBlock, element.nextSibling);
      }
      else {
        element.parentNode.appendChild(helpBlock);
      }
    }
    if (validationProperty) {
      helpBlock.textContent = validationProperty.message;

      if(validationProperty.message)
        helpBlock.classList.remove('aurelia-hide');
      else
        helpBlock.classList.add('aurelia-hide');
    }
    else {
      helpBlock.textContent = '';
      helpBlock.classList.add('aurelia-hide');
    }
  }


  appendUIVisuals(validationProperty, currentElement) {
    var formGroup = this.searchFormGroup(currentElement, 0);
    if (formGroup) {
      if (validationProperty && validationProperty.isDirty) {
        if (validationProperty.isValid) {
          formGroup.classList.remove('has-warning');
          formGroup.classList.add('has-success');
        }
        else {
          formGroup.classList.remove('has-success');
          formGroup.classList.add('has-warning');
        }
      }
      else {
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
  prepareElement(validationProperty, element){
    this.appendUIVisuals(null, element);
  }
  updateElement(validationProperty, element){
    this.appendUIVisuals(validationProperty, element);
  }
}
export class ValidateCustomAttributeViewStrategy { }
ValidateCustomAttributeViewStrategy.TWBootstrapAppendToInput = new TWBootstrapViewStrategy(true, false, 'aurelia-validation-message');
ValidateCustomAttributeViewStrategy.TWBootstrapAppendToMessage = new TWBootstrapViewStrategy(false, true, 'aurelia-validation-message');
