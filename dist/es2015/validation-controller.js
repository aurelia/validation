import { Validator } from './validator';
import { validateTrigger } from './validate-trigger';
import { getPropertyInfo } from './property-info';
import { ValidateResult } from './validate-result';
import { PropertyAccessorParser } from './property-accessor-parser';
import { ValidateEvent } from './validate-event';
/**
 * Orchestrates validation.
 * Manages a set of bindings, renderers and objects.
 * Exposes the current list of validation results for binding purposes.
 */
export class ValidationController {
    constructor(validator, propertyParser) {
        this.validator = validator;
        this.propertyParser = propertyParser;
        // Registered bindings (via the validate binding behavior)
        this.bindings = new Map();
        // Renderers that have been added to the controller instance.
        this.renderers = [];
        /**
         * Validation results that have been rendered by the controller.
         */
        this.results = [];
        /**
         * Validation errors that have been rendered by the controller.
         */
        this.errors = [];
        /**
         *  Whether the controller is currently validating.
         */
        this.validating = false;
        // Elements related to validation results that have been rendered.
        this.elements = new Map();
        // Objects that have been added to the controller instance (entity-style validation).
        this.objects = new Map();
        /**
         * The trigger that will invoke automatic validation of a property used in a binding.
         */
        this.validateTrigger = validateTrigger.blur;
        // Promise that resolves when validation has completed.
        this.finishValidating = Promise.resolve();
        this.eventCallbacks = [];
    }
    /**
     * Subscribe to controller validate and reset events. These events occur when the
     * controller's "validate"" and "reset" methods are called.
     * @param callback The callback to be invoked when the controller validates or resets.
     */
    subscribe(callback) {
        this.eventCallbacks.push(callback);
        return {
            dispose: () => {
                const index = this.eventCallbacks.indexOf(callback);
                if (index === -1) {
                    return;
                }
                this.eventCallbacks.splice(index, 1);
            }
        };
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
        this.processResultDelta('reset', this.results.filter(result => result.object === object), []);
    }
    /**
     * Adds and renders an error.
     */
    addError(message, object, propertyName = null) {
        let resolvedPropertyName;
        if (propertyName === null) {
            resolvedPropertyName = propertyName;
        }
        else {
            resolvedPropertyName = this.propertyParser.parse(propertyName);
        }
        const result = new ValidateResult({ __manuallyAdded__: true }, object, resolvedPropertyName, false, message);
        this.processResultDelta('validate', [], [result]);
        return result;
    }
    /**
     * Removes and unrenders an error.
     */
    removeError(result) {
        if (this.results.indexOf(result) !== -1) {
            this.processResultDelta('reset', [result], []);
        }
    }
    /**
     * Adds a renderer.
     * @param renderer The renderer.
     */
    addRenderer(renderer) {
        this.renderers.push(renderer);
        renderer.render({
            kind: 'validate',
            render: this.results.map(result => ({ result, elements: this.elements.get(result) })),
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
            kind: 'reset',
            render: [],
            unrender: this.results.map(result => ({ result, elements: this.elements.get(result) }))
        });
    }
    /**
     * Registers a binding with the controller.
     * @param binding The binding instance.
     * @param target The DOM element.
     * @param rules (optional) rules associated with the binding. Validator implementation specific.
     */
    registerBinding(binding, target, rules) {
        this.bindings.set(binding, { target, rules, propertyInfo: null });
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
     * relevant results in the list of rendered validation results.
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
            if (rules) {
                return x => predicate(x) && this.validator.ruleExists(rules, x.rule);
            }
            return predicate;
        }
        else {
            return () => true;
        }
    }
    /**
     * Validates and renders results.
     * @param instruction Optional. Instructions on what to validate. If undefined, all
     * objects and bindings will be validated.
     */
    validate(instruction) {
        // Get a function that will process the validation instruction.
        let execute;
        if (instruction) {
            // tslint:disable-next-line:prefer-const
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
                for (const [object, rules] of Array.from(this.objects)) {
                    promises.push(this.validator.validateObject(object, rules));
                }
                for (const [binding, { rules }] of Array.from(this.bindings)) {
                    const propertyInfo = getPropertyInfo(binding.sourceExpression, binding.source);
                    if (!propertyInfo || this.objects.has(propertyInfo.object)) {
                        continue;
                    }
                    promises.push(this.validator.validateProperty(propertyInfo.object, propertyInfo.propertyName, rules));
                }
                return Promise.all(promises).then(resultSets => resultSets.reduce((a, b) => a.concat(b), []));
            };
        }
        // Wait for any existing validation to finish, execute the instruction, render the results.
        this.validating = true;
        const returnPromise = this.finishValidating
            .then(execute)
            .then((newResults) => {
            const predicate = this.getInstructionPredicate(instruction);
            const oldResults = this.results.filter(predicate);
            this.processResultDelta('validate', oldResults, newResults);
            if (returnPromise === this.finishValidating) {
                this.validating = false;
            }
            const result = {
                instruction,
                valid: newResults.find(x => !x.valid) === undefined,
                results: newResults
            };
            this.invokeCallbacks(instruction, result);
            return result;
        })
            .catch(exception => {
            // recover, to enable subsequent calls to validate()
            this.validating = false;
            this.finishValidating = Promise.resolve();
            return Promise.reject(exception);
        });
        this.finishValidating = returnPromise;
        return returnPromise;
    }
    /**
     * Resets any rendered validation results (unrenders).
     * @param instruction Optional. Instructions on what to reset. If unspecified all rendered results
     * will be unrendered.
     */
    reset(instruction) {
        const predicate = this.getInstructionPredicate(instruction);
        const oldResults = this.results.filter(predicate);
        this.processResultDelta('reset', oldResults, []);
        this.invokeCallbacks(instruction, null);
    }
    /**
     * Gets the elements associated with an object and propertyName (if any).
     */
    getAssociatedElements({ object, propertyName }) {
        const elements = [];
        for (const [binding, { target }] of Array.from(this.bindings)) {
            const propertyInfo = getPropertyInfo(binding.sourceExpression, binding.source);
            if (propertyInfo && propertyInfo.object === object && propertyInfo.propertyName === propertyName) {
                elements.push(target);
            }
        }
        return elements;
    }
    processResultDelta(kind, oldResults, newResults) {
        // prepare the instruction.
        const instruction = {
            kind,
            render: [],
            unrender: []
        };
        // create a shallow copy of newResults so we can mutate it without causing side-effects.
        newResults = newResults.slice(0);
        // create unrender instructions from the old results.
        for (const oldResult of oldResults) {
            // get the elements associated with the old result.
            const elements = this.elements.get(oldResult);
            // remove the old result from the element map.
            this.elements.delete(oldResult);
            // create the unrender instruction.
            instruction.unrender.push({ result: oldResult, elements });
            // determine if there's a corresponding new result for the old result we are unrendering.
            const newResultIndex = newResults.findIndex(x => x.rule === oldResult.rule && x.object === oldResult.object && x.propertyName === oldResult.propertyName);
            if (newResultIndex === -1) {
                // no corresponding new result... simple remove.
                this.results.splice(this.results.indexOf(oldResult), 1);
                if (!oldResult.valid) {
                    this.errors.splice(this.errors.indexOf(oldResult), 1);
                }
            }
            else {
                // there is a corresponding new result...
                const newResult = newResults.splice(newResultIndex, 1)[0];
                // get the elements that are associated with the new result.
                const elements = this.getAssociatedElements(newResult);
                this.elements.set(newResult, elements);
                // create a render instruction for the new result.
                instruction.render.push({ result: newResult, elements });
                // do an in-place replacement of the old result with the new result.
                // this ensures any repeats bound to this.results will not thrash.
                this.results.splice(this.results.indexOf(oldResult), 1, newResult);
                if (!oldResult.valid && newResult.valid) {
                    this.errors.splice(this.errors.indexOf(oldResult), 1);
                }
                else if (!oldResult.valid && !newResult.valid) {
                    this.errors.splice(this.errors.indexOf(oldResult), 1, newResult);
                }
                else if (!newResult.valid) {
                    this.errors.push(newResult);
                }
            }
        }
        // create render instructions from the remaining new results.
        for (const result of newResults) {
            const elements = this.getAssociatedElements(result);
            instruction.render.push({ result, elements });
            this.elements.set(result, elements);
            this.results.push(result);
            if (!result.valid) {
                this.errors.push(result);
            }
        }
        // render.
        for (const renderer of this.renderers) {
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
        const propertyInfo = getPropertyInfo(binding.sourceExpression, binding.source);
        let rules;
        const registeredBinding = this.bindings.get(binding);
        if (registeredBinding) {
            rules = registeredBinding.rules;
            registeredBinding.propertyInfo = propertyInfo;
        }
        if (!propertyInfo) {
            return;
        }
        const { object, propertyName } = propertyInfo;
        this.validate({ object, propertyName, rules });
    }
    /**
     * Resets the results for a property associated with a binding.
     */
    resetBinding(binding) {
        const registeredBinding = this.bindings.get(binding);
        let propertyInfo = getPropertyInfo(binding.sourceExpression, binding.source);
        if (!propertyInfo && registeredBinding) {
            propertyInfo = registeredBinding.propertyInfo;
        }
        if (registeredBinding) {
            registeredBinding.propertyInfo = null;
        }
        if (!propertyInfo) {
            return;
        }
        const { object, propertyName } = propertyInfo;
        this.reset({ object, propertyName });
    }
    /**
     * Changes the controller's validateTrigger.
     * @param newTrigger The new validateTrigger
     */
    changeTrigger(newTrigger) {
        this.validateTrigger = newTrigger;
        const bindings = Array.from(this.bindings.keys());
        for (const binding of bindings) {
            const source = binding.source;
            binding.unbind();
            binding.bind(source);
        }
    }
    /**
     * Revalidates the controller's current set of errors.
     */
    revalidateErrors() {
        for (const { object, propertyName, rule } of this.errors) {
            if (rule.__manuallyAdded__) {
                continue;
            }
            const rules = [[rule]];
            this.validate({ object, propertyName, rules });
        }
    }
    invokeCallbacks(instruction, result) {
        if (this.eventCallbacks.length === 0) {
            return;
        }
        const event = new ValidateEvent(result ? 'validate' : 'reset', this.errors, this.results, instruction || null, result);
        for (let i = 0; i < this.eventCallbacks.length; i++) {
            this.eventCallbacks[i](event);
        }
    }
}
ValidationController.inject = [Validator, PropertyAccessorParser];
