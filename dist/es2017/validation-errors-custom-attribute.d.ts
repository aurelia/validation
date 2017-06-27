import { Lazy } from 'aurelia-dependency-injection';
import { ValidationController } from './validation-controller';
import { ValidateResult } from './validate-result';
import { ValidationRenderer, RenderInstruction } from './validation-renderer';
export interface RenderedError {
    error: ValidateResult;
    targets: Element[];
}
export declare class ValidationErrorsCustomAttribute implements ValidationRenderer {
    private boundaryElement;
    private controllerAccessor;
    static inject: ({
        new (): Element;
        prototype: Element;
    } | Lazy)[];
    controller: ValidationController | null;
    errors: RenderedError[];
    private errorsInternal;
    constructor(boundaryElement: Element, controllerAccessor: () => ValidationController);
    sort(): void;
    interestingElements(elements: Element[]): Element[];
    render(instruction: RenderInstruction): void;
    bind(): void;
    unbind(): void;
}
