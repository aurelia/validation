import {inject} from 'aurelia-dependency-injection';
import {customAttribute} from 'aurelia-templating';

@customAttribute('validate')
@inject(Element)
export class ValidateCustomAttribute {
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
    if (typeof (this.value) !== 'string') {
      //binding to a validation instance
      this.subscribeChangedHandlers(this.element);
    }
    return; //this is just to tell the real validation instance (higher in the DOM) the exact property-path to bind to
  }
  subscribeChangedHandlers(currentElement) {
    let viewStrategy = this.value.config.getViewStrategy();
    let validationProperty = viewStrategy.getValidationProperty(this.value, currentElement);
    let children = currentElement.children;
    this.viewStrategy = viewStrategy;
    if (validationProperty !== null && validationProperty !== undefined) {
      this.viewStrategy.prepareElement(validationProperty, currentElement);
      validationProperty.onValidate(
        (vp) => {
          this.viewStrategy.updateElement(vp, currentElement);
        }
      );
    }
    for (let i = 0; i < children.length; i++) {
      this.subscribeChangedHandlers(children[i]);
    }
  }
  attached() {
    if (this.processedValidation === null || this.processedValidation === undefined) {
      this.valueChanged(this.value);
    }
  }
}
