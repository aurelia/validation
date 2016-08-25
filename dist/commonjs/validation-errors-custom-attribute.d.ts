import { Lazy } from 'aurelia-dependency-injection';
import { ValidationController } from './validation-controller';
import { ValidationError } from './validation-error';
import { ValidationRenderer, RenderInstruction } from './validation-renderer';
export interface RenderedError {
    error: ValidationError;
    targets: Element[];
}
export declare class ValidationErrorsCustomAttribute implements ValidationRenderer {
    private boundaryElement;
    private controllerAccessor;
    static inject: ({
        new (): Element;
        prototype: Element;
    } | Lazy)[];
    value: RenderedError[];
    errors: RenderedError[];
    constructor(boundaryElement: Element, controllerAccessor: {
        (): ValidationController;
    });
    sort(): void;
    interestingElements(elements: Element[]): Element[];
    render(instruction: RenderInstruction): void;
    bind(): void;
    unbind(): void;
}
