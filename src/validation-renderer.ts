import {ValidationError} from './validation-error';

/**
 * An error to render (or unrender) and the associated elements (if any)
 */
export interface RenderErrorInstruction {
  /**
   * The validation error.
   */
  error: ValidationError;

  /**
   * The associated elements (if any).
   */
  elements: Element[];
}

/**
 * Defines which errors to render and which errors to unrender.
 */
export interface RenderInstruction {
  /**
   * The errors to render.
   */
  render: RenderErrorInstruction[];

  /**
   * The errors to unrender.
   */
  unrender: RenderErrorInstruction[];
}

/**
 * Renders validation errors.
 */
export interface ValidationRenderer {
  /**
   * Render the errors.
   * @param instruction The render instruction. Defines which errors to render and which
   * errors to unrender.
   */
  render(instruction: RenderInstruction): void;
}
