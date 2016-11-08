import { Binding } from 'aurelia-binding';
import { Validator } from './validator';
import { ValidationRenderer } from './validation-renderer';
import { ValidationError } from './validation-error';
export interface ValidateInstruction {
    /**
     * The object to validate.
     */
    object: any;
    /**
     * The property to validate. Optional.
     */
    propertyName?: any;
    /**
     * The rules to validate. Optional.
     */
    rules?: any;
}
/**
 * Orchestrates validation.
 * Manages a set of bindings, renderers and objects.
 * Exposes the current list of validation errors for binding purposes.
 */
export declare class ValidationController {
    private validator;
    static inject: typeof Validator[];
    private bindings;
    private renderers;
    /**
     * Errors that have been rendered by the controller.
     */
    errors: ValidationError[];
    /**
     *  Whether the controller is currently validating.
     */
    validating: boolean;
    private elements;
    private objects;
    /**
     * The trigger that will invoke automatic validation of a property used in a binding.
     */
    validateTrigger: number;
    private finishValidating;
    constructor(validator: Validator);
    /**
     * Adds an object to the set of objects that should be validated when validate is called.
     * @param object The object.
     * @param rules Optional. The rules. If rules aren't supplied the Validator implementation will lookup the rules.
     */
    addObject(object: any, rules?: any): void;
    /**
     * Removes an object from the set of objects that should be validated when validate is called.
     * @param object The object.
     */
    removeObject(object: any): void;
    /**
     * Adds and renders a ValidationError.
     */
    addError(message: string, object: any, propertyName?: string): ValidationError;
    /**
     * Removes and unrenders a ValidationError.
     */
    removeError(error: ValidationError): void;
    /**
     * Adds a renderer.
     * @param renderer The renderer.
     */
    addRenderer(renderer: ValidationRenderer): void;
    /**
     * Removes a renderer.
     * @param renderer The renderer.
     */
    removeRenderer(renderer: ValidationRenderer): void;
    /**
     * Registers a binding with the controller.
     * @param binding The binding instance.
     * @param target The DOM element.
     * @param rules (optional) rules associated with the binding. Validator implementation specific.
     */
    registerBinding(binding: Binding, target: Element, rules?: any): void;
    /**
     * Unregisters a binding with the controller.
     * @param binding The binding instance.
     */
    unregisterBinding(binding: Binding): void;
    /**
     * Interprets the instruction and returns a predicate that will identify
     * relevant errors in the list of rendered errors.
     */
    private getInstructionPredicate(instruction?);
    /**
     * Validates and renders errors.
     * @param instruction Optional. Instructions on what to validate. If undefined, all
     * objects and bindings will be validated.
     */
    validate(instruction?: ValidateInstruction): Promise<ValidationError[]>;
    /**
     * Resets any rendered errors (unrenders).
     * @param instruction Optional. Instructions on what to reset. If unspecified all rendered errors will be unrendered.
     */
    reset(instruction?: ValidateInstruction): void;
    /**
     * Gets the elements associated with an object and propertyName (if any).
     */
    private getAssociatedElements({object, propertyName});
    private processErrorDelta(kind, oldErrors, newErrors);
    /**
     * Validates the property associated with a binding.
     */
    validateBinding(binding: Binding): void;
    /**
     * Resets the errors for a property associated with a binding.
     */
    resetBinding(binding: Binding): void;
}
