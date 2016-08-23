import {bindingMode} from 'aurelia-binding';
import {Lazy} from 'aurelia-dependency-injection';
import {customAttribute} from 'aurelia-templating';
import {ValidationController} from './validation-controller';
import {ValidationError} from './validation-error';
import {ValidationRenderer, RenderInstruction} from './validation-renderer';

export interface RenderedError {
  error: ValidationError;
  targets: Element[];
}

@customAttribute('validation-errors', bindingMode.twoWay)
export class ValidationErrorsCustomAttribute implements ValidationRenderer {
  static inject = [Element, Lazy.of(ValidationController)];

  value: RenderedError[];
  errors: RenderedError[] = [];

  constructor(private boundaryElement: Element, private controllerAccessor: { (): ValidationController; }) {
  }

  sort() {
    this.errors.sort((a, b) => {
      if (a.targets[0] === b.targets[0]) {
        return 0;
      }
      return a.targets[0].compareDocumentPosition(b.targets[0]) & 2 ? 1 : -1;
    });
  }

  interestingElements(elements: Element[]): Element[] {
    return elements.filter(e => this.boundaryElement.contains(e));
  }

  render(instruction: RenderInstruction) {    
    for (let { error } of instruction.unrender) {
      const index = this.errors.findIndex(x => x.error === error);
      if (index !== -1) {
        this.errors.splice(index, 1);
      }
    }

    for (let { error, elements } of instruction.render) {
      const targets = this.interestingElements(elements);
      if (targets.length) {
        this.errors.push({ error: error, targets });
      }    
    }

    this.sort();
    this.value = this.errors;
  }

  bind() {
    this.controllerAccessor().addRenderer(this);
    this.value = this.errors;
  }

  unbind() {
    this.controllerAccessor().removeRenderer(this);
  }
}
