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
    if (this.value === null || this.value === undefined)
      return;
    this.processedValidation = this.value;
    if (typeof (this.value) === 'string') {
      return; //this is just to tell the real validation instance (higher in the DOM) the exact property-path to bind to
    }
    else {
      //binding to a validation instance
      this.subscribeChangedHandlers(this.element);
    }
  }
  subscribeChangedHandlers(currentElement) {
    this.viewStrategy = this.value.config.getViewStrategy();
    var validationProperty = this.viewStrategy.getValidationProperty(this.value, currentElement);
    if(validationProperty !== null && validationProperty !== undefined)
    {
      this.viewStrategy.prepareElement(validationProperty, currentElement);
      validationProperty.onValidate(
        (vp) => {
          this.viewStrategy.updateElement(vp, currentElement);
        }
      );
    }
    var children = currentElement.children;
    for (var i = 0; i < children.length; i++) {
      this.subscribeChangedHandlers(children[i]);
    }
  }

  detached() {
  }

  attached() {
    if (this.processedValidation === null || this.processedValidation === undefined)
      this.valueChanged(this.value);
  }
}
