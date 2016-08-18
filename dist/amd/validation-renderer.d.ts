import { ValidationError } from './validation-error';
export interface RenderAddInstruction {
    /**
     * The type of instruction. 'add', 'remove' or 'update'.
     */
    type: 'add';
    /**
     * The new error.
     */
    newError: ValidationError;
    /**
     * The DOM elements associated with the new error.
     */
    newElements: Element[];
}
export interface RenderRemoveInstruction {
    /**
     * The type of instruction. 'add', 'remove' or 'update'.
     */
    type: 'remove';
    /**
     * The old error.
     */
    oldError: ValidationError;
    /**
     * The DOM Elements associated with the old error.
     */
    oldElements: Element[];
}
export interface RenderUpdateInstruction {
    /**
     * The type of instruction. 'add', 'remove' or 'update'.
     */
    type: 'update';
    /**
     * The new error.
     */
    newError: ValidationError;
    /**
     * The DOM elements associated with the new error.
     */
    newElements: Element[];
    /**
     * The old error.
     */
    oldError: ValidationError;
    /**
     * The DOM Elements associated with the old error.
     */
    oldElements: Element[];
}
export declare type RenderInstruction = RenderAddInstruction | RenderUpdateInstruction | RenderRemoveInstruction;
/**
 * Renders validation errors.
 */
export interface ValidationRenderer {
    /**
     * Render the errors.
     * @param instructions The render instructions.
     */
    render(instructions: RenderInstruction[]): void;
}
