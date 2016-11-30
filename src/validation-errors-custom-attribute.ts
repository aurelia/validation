import { bindingMode } from 'aurelia-binding';
import { Lazy } from 'aurelia-dependency-injection';
import { customAttribute } from 'aurelia-templating';
import { ValidationController } from './validation-controller';
import { ValidateResult } from './validate-result';
import { ValidationRenderer, RenderInstruction } from './validation-renderer';

export interface RenderedError {
  error: ValidateResult;
  targets: Element[];
}

@customAttribute('validation-errors', bindingMode.twoWay)
export class ValidationErrorsCustomAttribute implements ValidationRenderer {
  public static inject = [Element, Lazy.of(ValidationController)];

  public value: RenderedError[];
  public errors: RenderedError[] = [];

  constructor(private boundaryElement: Element, private controllerAccessor: { (): ValidationController; }) {
  }

  public sort() {
    this.errors.sort((a, b) => {
      if (a.targets[0] === b.targets[0]) {
        return 0;
      }
      /* tslint:disable:no-bitwise */
      return a.targets[0].compareDocumentPosition(b.targets[0]) & 2 ? 1 : -1;
      /* tslint:enable:no-bitwise */
    });
  }

  public interestingElements(elements: Element[]): Element[] {
    return elements.filter(e => this.boundaryElement.contains(e));
  }

  public render(instruction: RenderInstruction) {
    for (let { result } of instruction.unrender) {
      const index = this.errors.findIndex(x => x.error === result);
      if (index !== -1) {
        this.errors.splice(index, 1);
      }
    }

    for (let { result, elements } of instruction.render) {
      if (result.valid) {
        continue;
      }
      const targets = this.interestingElements(elements);
      if (targets.length) {
        this.errors.push({ error: result, targets });
      }
    }

    this.sort();
    this.value = this.errors;
  }

  public bind() {
    this.controllerAccessor().addRenderer(this);
    this.value = this.errors;
  }

  public unbind() {
    this.controllerAccessor().removeRenderer(this);
  }
}
