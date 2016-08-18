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

  render(instructions: RenderInstruction[]) {    
    for (let instruction of instructions) {
      if (instruction.type === 'add') {
        const targets = this.interestingElements(instruction.newElements);
        if (targets.length) {
          this.errors.push({ error: instruction.newError, targets });
        }
      } else if (instruction.type === 'remove') {
        const instr = instruction; // TypeScript bug
        const index = this.errors.findIndex(x => x.error === instr.oldError);
        if (index !== -1) {
          this.errors.splice(index, 1);
        }
      } else if (instruction.type === 'update') {
        const instr = instruction; // TypeScript bug
        const index = this.errors.findIndex(x => x.error === instr.oldError);
        const targets = this.interestingElements(instruction.newElements);          
        if (index !== -1) {
          this.errors.splice(index, 1);
        }
        if (targets.length) {
          this.errors.push({ error: instruction.newError, targets })
        }
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
