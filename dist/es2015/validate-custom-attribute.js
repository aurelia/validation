var _dec, _dec2, _class;

import { inject } from 'aurelia-dependency-injection';
import { customAttribute } from 'aurelia-templating';

export let ValidateCustomAttribute = (_dec = customAttribute('validate'), _dec2 = inject(Element), _dec(_class = _dec2(_class = class ValidateCustomAttribute {
  constructor(element) {
    this.element = element;
    this.processedValidation = null;
    this.viewStrategy = null;
  }
  valueChanged(newValue) {
    if (this.value === null || this.value === undefined) {
      return;
    }
    this.processedValidation = this.value;
    if (typeof this.value !== 'string') {
      this.subscribeChangedHandlers(this.element);
    }
    return;
  }
  subscribeChangedHandlers(currentElement) {
    let viewStrategy = this.value.config.getViewStrategy();
    let validationProperty = viewStrategy.getValidationProperty(this.value, currentElement);
    let children = currentElement.children || currentElement.childNodes;
    this.viewStrategy = viewStrategy;
    if (validationProperty !== null && validationProperty !== undefined) {
      this.viewStrategy.prepareElement(validationProperty, currentElement);
      validationProperty.onValidate(vp => {
        this.viewStrategy.updateElement(vp, currentElement);
      });
    }
    for (let i = 0; i < children.length; i++) {
      if (children[i].nodeType == 3) continue;
      this.subscribeChangedHandlers(children[i]);
    }
  }
  attached() {
    if (this.processedValidation === null || this.processedValidation === undefined) {
      this.valueChanged(this.value);
    }
  }
}) || _class) || _class);