import {ValidationEngine} from 'aurelia-validate';
import {customAttribute} from 'aurelia-framework';
import {DOM} from 'aurelia-pal';

class FakeRenderer {
  renderErrors(element, errors) {
    if (errors) {
      element.classList.add('has-errors');
    }
  }
  unrenderErrors(element) {
    element.classList.remove('has-errors');
  }
}

export class RenderErrorsCustomAttribute {
  renderer = new FakeRenderer();
  element;
  static inject = [DOM.Element];
  constructor(element) {
    this.element = element;
  }

  bind(target, other, something) {
    console.log(other);
    console.log(something);
    let reporter = ValidationEngine.getValidationReporter(this.value);

    this.subscription = reporter.subscribe(errors => {
      console.log(errors);
      if (errors.length) {
        this.renderer.renderErrors(this.element, errors);
      } else {
        this.renderer.unrenderErrors(this.element);
      }
    });
  }

  unbind() {
    this.subscription.dispose();
  }
}
