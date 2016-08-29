import { Validator } from './validator';
import { validateTrigger } from './validate-trigger';
import { getPropertyInfo } from './property-info';
import { ValidationError } from './validation-error';
/**
 * Orchestrates validation.
 * Manages a set of bindings, renderers and objects.
 * Exposes the current list of validation errors for binding purposes.
 */
export class ValidationController {
    constructor(validator) {
        this.validator = validator;
        // Registered bindings (via the validate binding behavior)
        this.bindings = new Map();
        // Renderers that have been added to the controller instance.
        this.renderers = [];
        /**
         * Errors that have been rendered by the controller.
         */
        this.errors = [];
        /**
         *  Whether the controller is currently validating.
         */
        this.validating = false;
        // Elements related to errors that have been rendered.
        this.elements = new Map();
        // Objects that have been added to the controller instance (entity-style validation).
        this.objects = new Map();
        /**
         * The trigger that will invoke automatic validation of a property used in a binding.
         */
        this.validateTrigger = validateTrigger.blur;
        // Promise that resolves when validation has completed.
        this.finishValidating = Promise.resolve();
    }
    /**
     * Adds an object to the set of objects that should be validated when validate is called.
     * @param object The object.
     * @param rules Optional. The rules. If rules aren't supplied the Validator implementation will lookup the rules.
     */
    addObject(object, rules) {
        this.objects.set(object, rules);
    }
    /**
     * Removes an object from the set of objects that should be validated when validate is called.
     * @param object The object.
     */
    removeObject(object) {
        this.objects.delete(object);
        this.processErrorDelta(this.errors.filter(error => error.object === object), []);
    }
    /**
     * Adds and renders a ValidationError.
     */
    addError(message, object, propertyName) {
        const error = new ValidationError({}, message, object, propertyName);
        this.processErrorDelta([], [error]);
        return error;
    }
    /**
     * Removes and unrenders a ValidationError.
     */
    removeError(error) {
        if (this.errors.indexOf(error) !== -1) {
            this.processErrorDelta([error], []);
        }
    }
    /**
     * Adds a renderer.
     * @param renderer The renderer.
     */
    addRenderer(renderer) {
        this.renderers.push(renderer);
        renderer.render({
            render: this.errors.map(error => ({ error, elements: this.elements.get(error) })),
            unrender: []
        });
    }
    /**
     * Removes a renderer.
     * @param renderer The renderer.
     */
    removeRenderer(renderer) {
        this.renderers.splice(this.renderers.indexOf(renderer), 1);
        renderer.render({
            render: [],
            unrender: this.errors.map(error => ({ error, elements: this.elements.get(error) }))
        });
    }
    /**
     * Registers a binding with the controller.
     * @param binding The binding instance.
     * @param target The DOM element.
     * @param rules (optional) rules associated with the binding. Validator implementation specific.
     */
    registerBinding(binding, target, rules) {
        this.bindings.set(binding, { target, rules });
    }
    /**
     * Unregisters a binding with the controller.
     * @param binding The binding instance.
     */
    unregisterBinding(binding) {
        this.resetBinding(binding);
        this.bindings.delete(binding);
    }
    /**
     * Interprets the instruction and returns a predicate that will identify
     * relevant errors in the list of rendered errors.
     */
    getInstructionPredicate(instruction) {
        if (instruction) {
            const { object, propertyName, rules } = instruction;
            let predicate;
            if (instruction.propertyName) {
                predicate = x => x.object === object && x.propertyName === propertyName;
            }
            else {
                predicate = x => x.object === object;
            }
            // todo: move to Validator interface:
            if (rules && rules.indexOf) {
                return x => predicate(x) && rules.indexOf(x.rule) !== -1;
            }
            return predicate;
        }
        else {
            return () => true;
        }
    }
    /**
     * Validates and renders errors.
     * @param instruction Optional. Instructions on what to validate. If undefined, all objects and bindings will be validated.
     */
    validate(instruction) {
        // Get a function that will process the validation instruction.
        let execute;
        if (instruction) {
            let { object, propertyName, rules } = instruction;
            // if rules were not specified, check the object map.
            rules = rules || this.objects.get(object);
            // property specified?
            if (instruction.propertyName === undefined) {
                // validate the specified object.
                execute = () => this.validator.validateObject(object, rules);
            }
            else {
                // validate the specified property.
                execute = () => this.validator.validateProperty(object, propertyName, rules);
            }
        }
        else {
            // validate all objects and bindings.
            execute = () => {
                const promises = [];
                for (let [object, rules] of Array.from(this.objects)) {
                    promises.push(this.validator.validateObject(object, rules));
                }
                for (let [binding, { rules }] of Array.from(this.bindings)) {
                    const { object, propertyName } = getPropertyInfo(binding.sourceExpression, binding.source);
                    if (this.objects.has(object)) {
                        continue;
                    }
                    promises.push(this.validator.validateProperty(object, propertyName, rules));
                }
                return Promise.all(promises).then(errorSets => errorSets.reduce((a, b) => a.concat(b), []));
            };
        }
        // Wait for any existing validation to finish, execute the instruction, render the errors.
        this.validating = true;
        let result = this.finishValidating
            .then(execute)
            .then(newErrors => {
            const predicate = this.getInstructionPredicate(instruction);
            const oldErrors = this.errors.filter(predicate);
            this.processErrorDelta(oldErrors, newErrors);
            if (result === this.finishValidating) {
                this.validating = false;
            }
            return newErrors;
        })
            .catch(error => {
            // recover, to enable subsequent calls to validate()
            this.validating = false;
            this.finishValidating = Promise.resolve();
            return Promise.reject(error);
        });
        this.finishValidating = result;
        return result;
    }
    /**
     * Resets any rendered errors (unrenders).
     * @param instruction Optional. Instructions on what to reset. If unspecified all rendered errors will be unrendered.
     */
    reset(instruction) {
        const predicate = this.getInstructionPredicate(instruction);
        const oldErrors = this.errors.filter(predicate);
        this.processErrorDelta(oldErrors, []);
    }
    /**
     * Gets the elements associated with an object and propertyName (if any).
     */
    getAssociatedElements({ object, propertyName }) {
        const elements = [];
        for (let [binding, { target }] of Array.from(this.bindings)) {
            const { object: o, propertyName: p } = getPropertyInfo(binding.sourceExpression, binding.source);
            if (o === object && p === propertyName) {
                elements.push(target);
            }
        }
        return elements;
    }
    processErrorDelta(oldErrors, newErrors) {
        // prepare the instruction.
        const instruction = {
            render: [],
            unrender: []
        };
        // create a shallow copy of newErrors so we can mutate it without causing side-effects.
        newErrors = newErrors.slice(0);
        // create unrender instructions from the old errors.
        for (let oldError of oldErrors) {
            // get the elements associated with the old error.
            const elements = this.elements.get(oldError);
            // remove the old error from the element map.
            this.elements.delete(oldError);
            // create the unrender instruction.
            instruction.unrender.push({ error: oldError, elements });
            // determine if there's a corresponding new error for the old error we are unrendering.
            const newErrorIndex = newErrors.findIndex(x => x.rule === oldError.rule && x.object === oldError.object && x.propertyName === oldError.propertyName);
            if (newErrorIndex === -1) {
                // no corresponding new error... simple remove.
                this.errors.splice(this.errors.indexOf(oldError), 1);
            }
            else {
                // there is a corresponding new error...        
                const newError = newErrors.splice(newErrorIndex, 1)[0];
                // get the elements that are associated with the new error.
                const elements = this.getAssociatedElements(newError);
                this.elements.set(newError, elements);
                // create a render instruction for the new error.
                instruction.render.push({ error: newError, elements });
                // do an in-place replacement of the old error with the new error.
                // this ensures any repeats bound to this.errors will not thrash.
                this.errors.splice(this.errors.indexOf(oldError), 1, newError);
            }
        }
        // create render instructions from the remaining new errors.
        for (let error of newErrors) {
            const elements = this.getAssociatedElements(error);
            instruction.render.push({ error, elements });
            this.elements.set(error, elements);
            this.errors.push(error);
        }
        // render.
        for (let renderer of this.renderers) {
            renderer.render(instruction);
        }
    }
    /**
    * Validates the property associated with a binding.
    */
    validateBinding(binding) {
        if (!binding.isBound) {
            return;
        }
        const { object, propertyName } = getPropertyInfo(binding.sourceExpression, binding.source);
        const registeredBinding = this.bindings.get(binding);
        const rules = registeredBinding ? registeredBinding.rules : undefined;
        this.validate({ object, propertyName, rules });
    }
    /**
    * Resets the errors for a property associated with a binding.
    */
    resetBinding(binding) {
        const { object, propertyName } = getPropertyInfo(binding.sourceExpression, binding.source);
        this.reset({ object, propertyName });
    }
}
ValidationController.inject = [Validator];
