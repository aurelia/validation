import {ValidationEngine} from 'aurelia-validate';
import {customAttribute} from 'aurelia-framework';
import {DOM} from 'aurelia-pal';

class FakeRenderer {
  renderErrors(element, errors) {
    if (errors) {
      element.classList.add('has-errors');
    }
  }
}

export class ValidateCustomAttribute {
  renderer = new FakeRenderer();
  element;
  static inject = [DOM.Element];
  constructor(element) {
    this.element = element;
  }

  bind(target, other) {
    let reporter = ValidationEngine.getValidationReporter(this.value);

    this.subscription = reporter.subscribe(errors => {
      this.renderer.renderErrors(this.element, errors);
    });
  }

  unbind() {
    this.subscription.dispose();
  }
}