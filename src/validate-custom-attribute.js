import {ValidationEngine} from 'aurelia-validate';
import {customAttribute} from 'aurelia-framework';
import {DOM} from 'aurelia-pal';

class FakeRenderer {
  renderErrors(element, errors) {
    if (errors.length) {
      element.classList.add('has-errors');
    }
  }
  unrenderErrors(element) {
    element.classList.remove('has-errors');
  }
}

function getContext(value) {
  return value.split('.')[0];
}

function getValueName(value) {
  return value.split('.')[1];
}

export class ValidateCustomAttribute {
  renderer = new FakeRenderer();
  element;
  static inject = [DOM.Element];
  constructor(element) {
    this.element = element;
  }

  bind(target) {
    let context = getContext(this.value);
    let valueName = getValueName(this.value);
    let validationTarget = target[context];
    let reporter = ValidationEngine.getValidationReporter(validationTarget);

    this.subscription = reporter.subscribe(errors => {
      if (errors.length) {
        let theseErrors = [];
        errors.forEach(error => {
          let key = Object.keys(error)[0];
          if (key === valueName) {
            theseErrors.push(error);
          }
        });
        if (theseErrors.length) {
          this.renderer.renderErrors(this.element, theseErrors);
        } else {
          this.renderer.unrenderErrors(this.element);
        }
      }
    });
  }

  unbind() {
    this.subscription.dispose();
  }
}
