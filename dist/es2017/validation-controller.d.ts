import { Binding } from 'aurelia-binding';
import { Validator } from './validator';
import { validateTrigger } from './validate-trigger';
import { ValidationRenderer } from './validation-renderer';
import { ValidateResult } from './validate-result';
import { ValidateInstruction } from './validate-instruction';
import { ControllerValidateResult } from './controller-validate-result';
import { PropertyAccessorParser, PropertyAccessor } from './property-accessor-parser';
import { ValidateEvent } from './validate-event';
/**
 * Orchestrates validation.
 * Manages a set of bindings, renderers and objects.
 * Exposes the current list of validation results for binding purposes.
 */
export declare class ValidationController {
    private validator;
    private propertyParser;
    static inject: (typeof PropertyAccessorParser | typeof Validator)[];
    private bindings;
    private renderers;
    /**
     * Validation results that have been rendered by the controller.
     */
    private results;
    /**
     * Validation errors that have been rendered by the controller.
     */
    errors: ValidateResult[];
    /**
     *  Whether the controller is currently validating.
     */
    validating: boolean;
    private elements;
    private objects;
    /**
     * The trigger that will invoke automatic validation of a property used in a binding.
     */
    validateTrigger: validateTrigger;
    private finishValidating;
    private eventCallbacks;
    constructor(validator: Validator, propertyParser: PropertyAccessorParser);
    /**
     * Subscribe to controller validate and reset events. These events occur when the
     * controller's "validate"" and "reset" methods are called.
     * @param callback The callback to be invoked when the controller validates or resets.
     */
    subscribe(callback: (event: ValidateEvent) => void): {
        dispose: () => void;
    };
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
     * Adds and renders an error.
     */
    addError<TObject>(message: string, object: TObject, propertyName?: string | PropertyAccessor<TObject, string> | null): ValidateResult;
    /**
     * Removes and unrenders an error.
     */
    removeError(result: ValidateResult): void;
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
     * relevant results in the list of rendered validation results.
     */
    private getInstructionPredicate(instruction?);
    /**
     * Validates and renders results.
     * @param instruction Optional. Instructions on what to validate. If undefined, all
     * objects and bindings will be validated.
     */
    validate(instruction?: ValidateInstruction): Promise<ControllerValidateResult>;
    /**
     * Resets any rendered validation results (unrenders).
     * @param instruction Optional. Instructions on what to reset. If unspecified all rendered results
     * will be unrendered.
     */
    reset(instruction?: ValidateInstruction): void;
    /**
     * Gets the elements associated with an object and propertyName (if any).
     */
    private getAssociatedElements({object, propertyName});
    private processResultDelta(kind, oldResults, newResults);
    /**
     * Validates the property associated with a binding.
     */
    validateBinding(binding: Binding): void;
    /**
     * Resets the results for a property associated with a binding.
     */
    resetBinding(binding: Binding): void;
    /**
     * Changes the controller's validateTrigger.
     * @param newTrigger The new validateTrigger
     */
    changeTrigger(newTrigger: validateTrigger): void;
    /**
     * Revalidates the controller's current set of errors.
     */
    revalidateErrors(): void;
    private invokeCallbacks(instruction, result);
}
