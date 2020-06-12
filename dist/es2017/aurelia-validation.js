import { LiteralString, Binary, Conditional, LiteralPrimitive, CallMember, AccessMember, AccessScope, AccessKeyed, BindingBehavior, ValueConverter, getContextFor, Parser, bindingBehavior, bindingMode } from 'aurelia-binding';
import { BindingLanguage, ViewResources, customAttribute, bindable } from 'aurelia-templating';
import { getLogger } from 'aurelia-logging';
import { DOM } from 'aurelia-pal';
import { Optional, Lazy } from 'aurelia-dependency-injection';
import { TaskQueue } from 'aurelia-task-queue';

/**
 * Validates objects and properties.
 */
class Validator {
}

/**
 * The result of validating an individual validation rule.
 */
class ValidateResult {
    /**
     * @param rule The rule associated with the result. Validator implementation specific.
     * @param object The object that was validated.
     * @param propertyName The name of the property that was validated.
     * @param error The error, if the result is a validation error.
     */
    constructor(rule, object, propertyName, valid, message = null) {
        this.rule = rule;
        this.object = object;
        this.propertyName = propertyName;
        this.valid = valid;
        this.message = message;
        this.id = ValidateResult.nextId++;
    }
    toString() {
        return this.valid ? 'Valid.' : this.message;
    }
}
ValidateResult.nextId = 0;

/**
 * Sets, unsets and retrieves rules on an object or constructor function.
 */
class Rules {
    /**
     * Applies the rules to a target.
     */
    static set(target, rules) {
        if (target instanceof Function) {
            target = target.prototype;
        }
        Object.defineProperty(target, Rules.key, { enumerable: false, configurable: false, writable: true, value: rules });
    }
    /**
     * Removes rules from a target.
     */
    static unset(target) {
        if (target instanceof Function) {
            target = target.prototype;
        }
        target[Rules.key] = null;
    }
    /**
     * Retrieves the target's rules.
     */
    static get(target) {
        return target[Rules.key] || null;
    }
}
/**
 * The name of the property that stores the rules.
 */
Rules.key = '__rules__';

// tslint:disable:no-empty
class ExpressionVisitor {
    visitChain(chain) {
        this.visitArgs(chain.expressions);
    }
    visitBindingBehavior(behavior) {
        behavior.expression.accept(this);
        this.visitArgs(behavior.args);
    }
    visitValueConverter(converter) {
        converter.expression.accept(this);
        this.visitArgs(converter.args);
    }
    visitAssign(assign) {
        assign.target.accept(this);
        assign.value.accept(this);
    }
    visitConditional(conditional) {
        conditional.condition.accept(this);
        conditional.yes.accept(this);
        conditional.no.accept(this);
    }
    visitAccessThis(access) {
        access.ancestor = access.ancestor;
    }
    visitAccessScope(access) {
        access.name = access.name;
    }
    visitAccessMember(access) {
        access.object.accept(this);
    }
    visitAccessKeyed(access) {
        access.object.accept(this);
        access.key.accept(this);
    }
    visitCallScope(call) {
        this.visitArgs(call.args);
    }
    visitCallFunction(call) {
        call.func.accept(this);
        this.visitArgs(call.args);
    }
    visitCallMember(call) {
        call.object.accept(this);
        this.visitArgs(call.args);
    }
    visitPrefix(prefix) {
        prefix.expression.accept(this);
    }
    visitBinary(binary) {
        binary.left.accept(this);
        binary.right.accept(this);
    }
    visitLiteralPrimitive(literal) {
        literal.value = literal.value;
    }
    visitLiteralArray(literal) {
        this.visitArgs(literal.elements);
    }
    visitLiteralObject(literal) {
        this.visitArgs(literal.values);
    }
    visitLiteralString(literal) {
        literal.value = literal.value;
    }
    visitArgs(args) {
        for (let i = 0; i < args.length; i++) {
            args[i].accept(this);
        }
    }
}

class ValidationMessageParser {
    constructor(bindinqLanguage) {
        this.bindinqLanguage = bindinqLanguage;
        this.emptyStringExpression = new LiteralString('');
        this.nullExpression = new LiteralPrimitive(null);
        this.undefinedExpression = new LiteralPrimitive(undefined);
        this.cache = {};
    }
    parse(message) {
        if (this.cache[message] !== undefined) {
            return this.cache[message];
        }
        const parts = this.bindinqLanguage.parseInterpolation(null, message);
        if (parts === null) {
            return new LiteralString(message);
        }
        let expression = new LiteralString(parts[0]);
        for (let i = 1; i < parts.length; i += 2) {
            expression = new Binary('+', expression, new Binary('+', this.coalesce(parts[i]), new LiteralString(parts[i + 1])));
        }
        MessageExpressionValidator.validate(expression, message);
        this.cache[message] = expression;
        return expression;
    }
    coalesce(part) {
        // part === null || part === undefined ? '' : part
        return new Conditional(new Binary('||', new Binary('===', part, this.nullExpression), new Binary('===', part, this.undefinedExpression)), this.emptyStringExpression, new CallMember(part, 'toString', []));
    }
}
ValidationMessageParser.inject = [BindingLanguage];
class MessageExpressionValidator extends ExpressionVisitor {
    constructor(originalMessage) {
        super();
        this.originalMessage = originalMessage;
    }
    static validate(expression, originalMessage) {
        const visitor = new MessageExpressionValidator(originalMessage);
        expression.accept(visitor);
    }
    visitAccessScope(access) {
        if (access.ancestor !== 0) {
            throw new Error('$parent is not permitted in validation message expressions.');
        }
        if (['displayName', 'propertyName', 'value', 'object', 'config', 'getDisplayName'].indexOf(access.name) !== -1) {
            getLogger('aurelia-validation')
                // tslint:disable-next-line:max-line-length
                .warn(`Did you mean to use "$${access.name}" instead of "${access.name}" in this validation message template: "${this.originalMessage}"?`);
        }
    }
}

/**
 * Dictionary of validation messages. [messageKey]: messageExpression
 */
const validationMessages = {
    /**
     * The default validation message. Used with rules that have no standard message.
     */
    default: `\${$displayName} is invalid.`,
    required: `\${$displayName} is required.`,
    matches: `\${$displayName} is not correctly formatted.`,
    email: `\${$displayName} is not a valid email.`,
    minLength: `\${$displayName} must be at least \${$config.length} character\${$config.length === 1 ? '' : 's'}.`,
    maxLength: `\${$displayName} cannot be longer than \${$config.length} character\${$config.length === 1 ? '' : 's'}.`,
    minItems: `\${$displayName} must contain at least \${$config.count} item\${$config.count === 1 ? '' : 's'}.`,
    maxItems: `\${$displayName} cannot contain more than \${$config.count} item\${$config.count === 1 ? '' : 's'}.`,
    min: `\${$displayName} must be at least \${$config.constraint}.`,
    max: `\${$displayName} must be at most \${$config.constraint}.`,
    range: `\${$displayName} must be between or equal to \${$config.min} and \${$config.max}.`,
    between: `\${$displayName} must be between but not equal to \${$config.min} and \${$config.max}.`,
    equals: `\${$displayName} must be \${$config.expectedValue}.`,
};
/**
 * Retrieves validation messages and property display names.
 */
class ValidationMessageProvider {
    constructor(parser) {
        this.parser = parser;
    }
    /**
     * Returns a message binding expression that corresponds to the key.
     * @param key The message key.
     */
    getMessage(key) {
        let message;
        if (key in validationMessages) {
            message = validationMessages[key];
        }
        else {
            message = validationMessages['default'];
        }
        return this.parser.parse(message);
    }
    /**
     * Formulates a property display name using the property name and the configured
     * displayName (if provided).
     * Override this with your own custom logic.
     * @param propertyName The property name.
     */
    getDisplayName(propertyName, displayName) {
        if (displayName !== null && displayName !== undefined) {
            return (displayName instanceof Function) ? displayName() : displayName;
        }
        // split on upper-case letters.
        const words = propertyName.toString().split(/(?=[A-Z])/).join(' ');
        // capitalize first letter.
        return words.charAt(0).toUpperCase() + words.slice(1);
    }
}
ValidationMessageProvider.inject = [ValidationMessageParser];

/**
 * Validates.
 * Responsible for validating objects and properties.
 */
class StandardValidator extends Validator {
    constructor(messageProvider, resources) {
        super();
        this.messageProvider = messageProvider;
        this.lookupFunctions = resources.lookupFunctions;
        this.getDisplayName = messageProvider.getDisplayName.bind(messageProvider);
    }
    /**
     * Validates the specified property.
     * @param object The object to validate.
     * @param propertyName The name of the property to validate.
     * @param rules Optional. If unspecified, the rules will be looked up using the metadata
     * for the object created by ValidationRules....on(class/object)
     */
    validateProperty(object, propertyName, rules) {
        return this.validate(object, propertyName, rules || null);
    }
    /**
     * Validates all rules for specified object and it's properties.
     * @param object The object to validate.
     * @param rules Optional. If unspecified, the rules will be looked up using the metadata
     * for the object created by ValidationRules....on(class/object)
     */
    validateObject(object, rules) {
        return this.validate(object, null, rules || null);
    }
    /**
     * Determines whether a rule exists in a set of rules.
     * @param rules The rules to search.
     * @parem rule The rule to find.
     */
    ruleExists(rules, rule) {
        let i = rules.length;
        while (i--) {
            if (rules[i].indexOf(rule) !== -1) {
                return true;
            }
        }
        return false;
    }
    getMessage(rule, object, value) {
        const expression = rule.message || this.messageProvider.getMessage(rule.messageKey);
        // tslint:disable-next-line:prefer-const
        let { name: propertyName, displayName } = rule.property;
        if (propertyName !== null) {
            displayName = this.messageProvider.getDisplayName(propertyName, displayName);
        }
        const overrideContext = {
            $displayName: displayName,
            $propertyName: propertyName,
            $value: value,
            $object: object,
            $config: rule.config,
            // returns the name of a given property, given just the property name (irrespective of the property's displayName)
            // split on capital letters, first letter ensured to be capitalized
            $getDisplayName: this.getDisplayName
        };
        return expression.evaluate({ bindingContext: object, overrideContext }, this.lookupFunctions);
    }
    validateRuleSequence(object, propertyName, ruleSequence, sequence, results) {
        // are we validating all properties or a single property?
        const validateAllProperties = propertyName === null || propertyName === undefined;
        const rules = ruleSequence[sequence];
        let allValid = true;
        // validate each rule.
        const promises = [];
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            // is the rule related to the property we're validating.
            // tslint:disable-next-line:triple-equals | Use loose equality for property keys
            if (!validateAllProperties && rule.property.name != propertyName) {
                continue;
            }
            // is this a conditional rule? is the condition met?
            if (rule.when && !rule.when(object)) {
                continue;
            }
            // validate.
            const value = rule.property.name === null ? object : object[rule.property.name];
            let promiseOrBoolean = rule.condition(value, object);
            if (!(promiseOrBoolean instanceof Promise)) {
                promiseOrBoolean = Promise.resolve(promiseOrBoolean);
            }
            promises.push(promiseOrBoolean.then(valid => {
                const message = valid ? null : this.getMessage(rule, object, value);
                results.push(new ValidateResult(rule, object, rule.property.name, valid, message));
                allValid = allValid && valid;
                return valid;
            }));
        }
        return Promise.all(promises)
            .then(() => {
            sequence++;
            if (allValid && sequence < ruleSequence.length) {
                return this.validateRuleSequence(object, propertyName, ruleSequence, sequence, results);
            }
            return results;
        });
    }
    validate(object, propertyName, rules) {
        // rules specified?
        if (!rules) {
            // no. attempt to locate the rules.
            rules = Rules.get(object);
        }
        // any rules?
        if (!rules || rules.length === 0) {
            return Promise.resolve([]);
        }
        return this.validateRuleSequence(object, propertyName, rules, 0, []);
    }
}
StandardValidator.inject = [ValidationMessageProvider, ViewResources];

/**
 * Validation triggers.
 */
var validateTrigger;
(function (validateTrigger) {
    /**
     * Manual validation.  Use the controller's `validate()` and  `reset()` methods
     * to validate all bindings.
     */
    validateTrigger[validateTrigger["manual"] = 0] = "manual";
    /**
     * Validate the binding when the binding's target element fires a DOM "blur" event.
     */
    validateTrigger[validateTrigger["blur"] = 1] = "blur";
    /**
     * Validate the binding when it updates the model due to a change in the view.
     */
    validateTrigger[validateTrigger["change"] = 2] = "change";
    /**
     * Validate the binding when the binding's target element fires a DOM "blur" event and
     * when it updates the model due to a change in the view.
     */
    validateTrigger[validateTrigger["changeOrBlur"] = 3] = "changeOrBlur";
    /**
     * Validate the binding when the binding's target element fires a DOM "focusout" event.
     * Unlike "blur", this event bubbles.
     */
    validateTrigger[validateTrigger["focusout"] = 4] = "focusout";
    /**
     * Validate the binding when the binding's target element fires a DOM "focusout" event or
     * when it updates the model due to a change in the view.
     */
    validateTrigger[validateTrigger["changeOrFocusout"] = 6] = "changeOrFocusout";
})(validateTrigger || (validateTrigger = {}));

/**
 * Aurelia Validation Configuration API
 */
class GlobalValidationConfiguration {
    constructor() {
        this.validatorType = StandardValidator;
        this.validationTrigger = GlobalValidationConfiguration.DEFAULT_VALIDATION_TRIGGER;
    }
    /**
     * Use a custom Validator implementation.
     */
    customValidator(type) {
        this.validatorType = type;
        return this;
    }
    defaultValidationTrigger(trigger) {
        this.validationTrigger = trigger;
        return this;
    }
    getDefaultValidationTrigger() {
        return this.validationTrigger;
    }
    /**
     * Applies the configuration.
     */
    apply(container) {
        const validator = container.get(this.validatorType);
        container.registerInstance(Validator, validator);
        container.registerInstance(GlobalValidationConfiguration, this);
    }
}
GlobalValidationConfiguration.DEFAULT_VALIDATION_TRIGGER = validateTrigger.blur;

/**
 * Gets the DOM element associated with the data-binding. Most of the time it's
 * the binding.target but sometimes binding.target is an aurelia custom element,
 * or custom attribute which is a javascript "class" instance, so we need to use
 * the controller's container to retrieve the actual DOM element.
 */
function getTargetDOMElement(binding, view) {
    const target = binding.target;
    // DOM element
    if (target instanceof Element) {
        return target;
    }
    // custom element or custom attribute
    // tslint:disable-next-line:prefer-const
    for (let i = 0, ii = view.controllers.length; i < ii; i++) {
        const controller = view.controllers[i];
        if (controller.viewModel === target) {
            const element = controller.container.get(DOM.Element);
            if (element) {
                return element;
            }
            throw new Error(`Unable to locate target element for "${binding.sourceExpression}".`);
        }
    }
    throw new Error(`Unable to locate target element for "${binding.sourceExpression}".`);
}

function getObject(expression, objectExpression, source) {
    const value = objectExpression.evaluate(source, null);
    if (value === null || value === undefined || value instanceof Object) {
        return value;
    }
    // tslint:disable-next-line:max-line-length
    throw new Error(`The '${objectExpression}' part of '${expression}' evaluates to ${value} instead of an object, null or undefined.`);
}
/**
 * Retrieves the object and property name for the specified expression.
 * @param expression The expression
 * @param source The scope
 */
function getPropertyInfo(expression, source) {
    const originalExpression = expression;
    while (expression instanceof BindingBehavior || expression instanceof ValueConverter) {
        expression = expression.expression;
    }
    let object;
    let propertyName;
    if (expression instanceof AccessScope) {
        object = getContextFor(expression.name, source, expression.ancestor);
        propertyName = expression.name;
    }
    else if (expression instanceof AccessMember) {
        object = getObject(originalExpression, expression.object, source);
        propertyName = expression.name;
    }
    else if (expression instanceof AccessKeyed) {
        object = getObject(originalExpression, expression.object, source);
        propertyName = expression.key.evaluate(source);
    }
    else {
        throw new Error(`Expression '${originalExpression}' is not compatible with the validate binding-behavior.`);
    }
    if (object === null || object === undefined) {
        return null;
    }
    return { object, propertyName };
}

function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
}
function isNumber(value) {
    return Object.prototype.toString.call(value) === '[object Number]';
}

class PropertyAccessorParser {
    constructor(parser) {
        this.parser = parser;
    }
    parse(property) {
        if (isString(property) || isNumber(property)) {
            return property;
        }
        const accessorText = getAccessorExpression(property.toString());
        const accessor = this.parser.parse(accessorText);
        if (accessor instanceof AccessScope
            || accessor instanceof AccessMember && accessor.object instanceof AccessScope) {
            return accessor.name;
        }
        throw new Error(`Invalid property expression: "${accessor}"`);
    }
}
PropertyAccessorParser.inject = [Parser];
function getAccessorExpression(fn) {
    /* tslint:disable:max-line-length */
    const classic = /^function\s*\([$_\w\d]+\)\s*\{(?:\s*"use strict";)?(?:[$_\s\w\d\/\*.['"\]+;]+)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
    /* tslint:enable:max-line-length */
    const arrow = /^\(?[$_\w\d]+\)?\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
    const match = classic.exec(fn) || arrow.exec(fn);
    if (match === null) {
        throw new Error(`Unable to parse accessor function:\n${fn}`);
    }
    return match[1];
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

class ValidateEvent {
    constructor(
    /**
     * The type of validate event. Either "validate" or "reset".
     */
    type, 
    /**
     * The controller's current array of errors. For an array containing both
     * failed rules and passed rules, use the "results" property.
     */
    errors, 
    /**
     * The controller's current array of validate results. This
     * includes both passed rules and failed rules. For an array of only failed rules,
     * use the "errors" property.
     */
    results, 
    /**
     * The instruction passed to the "validate" or "reset" event. Will be null when
     * the controller's validate/reset method was called with no instruction argument.
     */
    instruction, 
    /**
     * In events with type === "validate", this property will contain the result
     * of validating the instruction (see "instruction" property). Use the controllerValidateResult
     * to access the validate results specific to the call to "validate"
     * (as opposed to using the "results" and "errors" properties to access the controller's entire
     * set of results/errors).
     */
    controllerValidateResult) {
        this.type = type;
        this.errors = errors;
        this.results = results;
        this.instruction = instruction;
        this.controllerValidateResult = controllerValidateResult;
    }
}

/**
 * Orchestrates validation.
 * Manages a set of bindings, renderers and objects.
 * Exposes the current list of validation results for binding purposes.
 */
class ValidationController {
    constructor(validator, propertyParser, config) {
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
        // Promise that resolves when validation has completed.
        this.finishValidating = Promise.resolve();
        this.eventCallbacks = [];
        this.validateTrigger = config instanceof GlobalValidationConfiguration
            ? config.getDefaultValidationTrigger()
            : GlobalValidationConfiguration.DEFAULT_VALIDATION_TRIGGER;
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
ValidationController.inject = [Validator, PropertyAccessorParser, GlobalValidationConfiguration];

// tslint:disable:no-bitwise
/**
 * Binding behavior. Indicates the bound property should be validated.
 */
class ValidateBindingBehaviorBase {
    constructor(taskQueue) {
        this.taskQueue = taskQueue;
    }
    bind(binding, source, rulesOrController, rules) {
        // identify the target element.
        const target = getTargetDOMElement(binding, source);
        // locate the controller.
        let controller;
        if (rulesOrController instanceof ValidationController) {
            controller = rulesOrController;
        }
        else {
            controller = source.container.get(Optional.of(ValidationController));
            rules = rulesOrController;
        }
        if (controller === null) {
            throw new Error(`A ValidationController has not been registered.`);
        }
        controller.registerBinding(binding, target, rules);
        binding.validationController = controller;
        const trigger = this.getValidateTrigger(controller);
        const event = (trigger & validateTrigger.blur) === validateTrigger.blur ? 'blur'
            : (trigger & validateTrigger.focusout) === validateTrigger.focusout ? 'focusout'
                : null;
        const hasChangeTrigger = (trigger & validateTrigger.change) === validateTrigger.change;
        binding.isDirty = !hasChangeTrigger;
        // validatedOnce is used to control whether controller should validate upon user input
        //
        // always true when validation trigger doesn't include "blur" event (blur/focusout)
        // else it will be set to true after (a) the first user input & loss of focus or (b) validation
        binding.validatedOnce = hasChangeTrigger && event === null;
        if (hasChangeTrigger) {
            binding.vbbUpdateSource = binding.updateSource;
            // tslint:disable-next-line:only-arrow-functions
            // tslint:disable-next-line:space-before-function-paren
            binding.updateSource = function (value) {
                this.vbbUpdateSource(value);
                this.isDirty = true;
                if (this.validatedOnce) {
                    this.validationController.validateBinding(this);
                }
            };
        }
        if (event !== null) {
            binding.focusLossHandler = () => {
                this.taskQueue.queueMicroTask(() => {
                    if (binding.isDirty) {
                        controller.validateBinding(binding);
                        binding.validatedOnce = true;
                    }
                });
            };
            binding.validationTriggerEvent = event;
            binding.validateTarget = target;
            target.addEventListener(event, binding.focusLossHandler);
            if (hasChangeTrigger) {
                const { propertyName } = getPropertyInfo(binding.sourceExpression, binding.source);
                binding.validationSubscription = controller.subscribe((event) => {
                    if (!binding.validatedOnce && event.type === 'validate') {
                        binding.validatedOnce = event.errors.findIndex((e) => e.propertyName === propertyName) > -1;
                    }
                });
            }
        }
        if (trigger !== validateTrigger.manual) {
            binding.standardUpdateTarget = binding.updateTarget;
            // tslint:disable-next-line:only-arrow-functions
            // tslint:disable-next-line:space-before-function-paren
            binding.updateTarget = function (value) {
                this.standardUpdateTarget(value);
                this.validationController.resetBinding(this);
            };
        }
    }
    unbind(binding) {
        // reset the binding to it's original state.
        if (binding.vbbUpdateSource) {
            binding.updateSource = binding.vbbUpdateSource;
            binding.vbbUpdateSource = null;
        }
        if (binding.standardUpdateTarget) {
            binding.updateTarget = binding.standardUpdateTarget;
            binding.standardUpdateTarget = null;
        }
        if (binding.focusLossHandler) {
            binding.validateTarget.removeEventListener(binding.validationTriggerEvent, binding.focusLossHandler);
            binding.focusLossHandler = null;
            binding.validateTarget = null;
        }
        if (binding.validationSubscription) {
            binding.validationSubscription.dispose();
            binding.validationSubscription = null;
        }
        binding.validationController.unregisterBinding(binding);
        binding.validationController = null;
        binding.isDirty = null;
        binding.validatedOnce = null;
    }
}

/**
 * Binding behavior. Indicates the bound property should be validated
 * when the validate trigger specified by the associated controller's
 * validateTrigger property occurs.
 */
let ValidateBindingBehavior = class ValidateBindingBehavior extends ValidateBindingBehaviorBase {
    getValidateTrigger(controller) {
        return controller.validateTrigger;
    }
};
ValidateBindingBehavior.inject = [TaskQueue];
ValidateBindingBehavior = __decorate([
    bindingBehavior('validate')
], ValidateBindingBehavior);
/**
 * Binding behavior. Indicates the bound property will be validated
 * manually, by calling controller.validate(). No automatic validation
 * triggered by data-entry or blur will occur.
 */
let ValidateManuallyBindingBehavior = class ValidateManuallyBindingBehavior extends ValidateBindingBehaviorBase {
    getValidateTrigger() {
        return validateTrigger.manual;
    }
};
ValidateManuallyBindingBehavior.inject = [TaskQueue];
ValidateManuallyBindingBehavior = __decorate([
    bindingBehavior('validateManually')
], ValidateManuallyBindingBehavior);
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs.
 */
let ValidateOnBlurBindingBehavior = class ValidateOnBlurBindingBehavior extends ValidateBindingBehaviorBase {
    getValidateTrigger() {
        return validateTrigger.blur;
    }
};
ValidateOnBlurBindingBehavior.inject = [TaskQueue];
ValidateOnBlurBindingBehavior = __decorate([
    bindingBehavior('validateOnBlur')
], ValidateOnBlurBindingBehavior);
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element is changed by the user, causing a change
 * to the model.
 */
let ValidateOnChangeBindingBehavior = class ValidateOnChangeBindingBehavior extends ValidateBindingBehaviorBase {
    getValidateTrigger() {
        return validateTrigger.change;
    }
};
ValidateOnChangeBindingBehavior.inject = [TaskQueue];
ValidateOnChangeBindingBehavior = __decorate([
    bindingBehavior('validateOnChange')
], ValidateOnChangeBindingBehavior);
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs or is changed by the user, causing
 * a change to the model.
 */
let ValidateOnChangeOrBlurBindingBehavior = class ValidateOnChangeOrBlurBindingBehavior extends ValidateBindingBehaviorBase {
    getValidateTrigger() {
        return validateTrigger.changeOrBlur;
    }
};
ValidateOnChangeOrBlurBindingBehavior.inject = [TaskQueue];
ValidateOnChangeOrBlurBindingBehavior = __decorate([
    bindingBehavior('validateOnChangeOrBlur')
], ValidateOnChangeOrBlurBindingBehavior);
let ValidateOnFocusoutBindingBehavior = class ValidateOnFocusoutBindingBehavior extends ValidateBindingBehaviorBase {
    getValidateTrigger() {
        return validateTrigger.focusout;
    }
};
ValidateOnFocusoutBindingBehavior.inject = [TaskQueue];
ValidateOnFocusoutBindingBehavior = __decorate([
    bindingBehavior('validateOnFocusout')
], ValidateOnFocusoutBindingBehavior);
let ValidateOnChangeOrFocusoutBindingBehavior = class ValidateOnChangeOrFocusoutBindingBehavior extends ValidateBindingBehaviorBase {
    getValidateTrigger() {
        return validateTrigger.changeOrFocusout;
    }
};
ValidateOnChangeOrFocusoutBindingBehavior.inject = [TaskQueue];
ValidateOnChangeOrFocusoutBindingBehavior = __decorate([
    bindingBehavior('validateOnChangeOrFocusout')
], ValidateOnChangeOrFocusoutBindingBehavior);

/**
 * Creates ValidationController instances.
 */
class ValidationControllerFactory {
    constructor(container) {
        this.container = container;
    }
    static get(container) {
        return new ValidationControllerFactory(container);
    }
    /**
     * Creates a new controller instance.
     */
    create(validator) {
        if (!validator) {
            validator = this.container.get(Validator);
        }
        const propertyParser = this.container.get(PropertyAccessorParser);
        const config = this.container.get(GlobalValidationConfiguration);
        return new ValidationController(validator, propertyParser, config);
    }
    /**
     * Creates a new controller and registers it in the current element's container so that it's
     * available to the validate binding behavior and renderers.
     */
    createForCurrentScope(validator) {
        const controller = this.create(validator);
        this.container.registerInstance(ValidationController, controller);
        return controller;
    }
}
ValidationControllerFactory['protocol:aurelia:resolver'] = true;

let ValidationErrorsCustomAttribute = class ValidationErrorsCustomAttribute {
    constructor(boundaryElement, controllerAccessor) {
        this.boundaryElement = boundaryElement;
        this.controllerAccessor = controllerAccessor;
        this.controller = null;
        this.errors = [];
        this.errorsInternal = [];
    }
    static inject() {
        return [DOM.Element, Lazy.of(ValidationController)];
    }
    sort() {
        this.errorsInternal.sort((a, b) => {
            if (a.targets[0] === b.targets[0]) {
                return 0;
            }
            // tslint:disable-next-line:no-bitwise
            return a.targets[0].compareDocumentPosition(b.targets[0]) & 2 ? 1 : -1;
        });
    }
    interestingElements(elements) {
        return elements.filter(e => this.boundaryElement.contains(e));
    }
    render(instruction) {
        for (const { result } of instruction.unrender) {
            const index = this.errorsInternal.findIndex(x => x.error === result);
            if (index !== -1) {
                this.errorsInternal.splice(index, 1);
            }
        }
        for (const { result, elements } of instruction.render) {
            if (result.valid) {
                continue;
            }
            const targets = this.interestingElements(elements);
            if (targets.length) {
                this.errorsInternal.push({ error: result, targets });
            }
        }
        this.sort();
        this.errors = this.errorsInternal;
    }
    bind() {
        if (!this.controller) {
            this.controller = this.controllerAccessor();
        }
        // this will call render() with the side-effect of updating this.errors
        this.controller.addRenderer(this);
    }
    unbind() {
        if (this.controller) {
            this.controller.removeRenderer(this);
        }
    }
};
__decorate([
    bindable({ defaultBindingMode: bindingMode.oneWay })
], ValidationErrorsCustomAttribute.prototype, "controller", void 0);
__decorate([
    bindable({ primaryProperty: true, defaultBindingMode: bindingMode.twoWay })
], ValidationErrorsCustomAttribute.prototype, "errors", void 0);
ValidationErrorsCustomAttribute = __decorate([
    customAttribute('validation-errors')
], ValidationErrorsCustomAttribute);

let ValidationRendererCustomAttribute = class ValidationRendererCustomAttribute {
    created(view) {
        this.container = view.container;
    }
    bind() {
        this.controller = this.container.get(ValidationController);
        this.renderer = this.container.get(this.value);
        this.controller.addRenderer(this.renderer);
    }
    unbind() {
        this.controller.removeRenderer(this.renderer);
        this.controller = null;
        this.renderer = null;
    }
};
ValidationRendererCustomAttribute = __decorate([
    customAttribute('validation-renderer')
], ValidationRendererCustomAttribute);

/**
 * Part of the fluent rule API. Enables customizing property rules.
 */
class FluentRuleCustomizer {
    constructor(property, condition, config = {}, fluentEnsure, fluentRules, parsers) {
        this.fluentEnsure = fluentEnsure;
        this.fluentRules = fluentRules;
        this.parsers = parsers;
        this.rule = {
            property,
            condition,
            config,
            when: null,
            messageKey: 'default',
            message: null,
            sequence: fluentRules.sequence
        };
        this.fluentEnsure._addRule(this.rule);
    }
    /**
     * Validate subsequent rules after previously declared rules have
     * been validated successfully. Use to postpone validation of costly
     * rules until less expensive rules pass validation.
     */
    then() {
        this.fluentRules.sequence++;
        return this;
    }
    /**
     * Specifies the key to use when looking up the rule's validation message.
     */
    withMessageKey(key) {
        this.rule.messageKey = key;
        this.rule.message = null;
        return this;
    }
    /**
     * Specifies rule's validation message.
     */
    withMessage(message) {
        this.rule.messageKey = 'custom';
        this.rule.message = this.parsers.message.parse(message);
        return this;
    }
    /**
     * Specifies a condition that must be met before attempting to validate the rule.
     * @param condition A function that accepts the object as a parameter and returns true
     * or false whether the rule should be evaluated.
     */
    when(condition) {
        this.rule.when = condition;
        return this;
    }
    /**
     * Tags the rule instance, enabling the rule to be found easily
     * using ValidationRules.taggedRules(rules, tag)
     */
    tag(tag) {
        this.rule.tag = tag;
        return this;
    }
    ///// FluentEnsure APIs /////
    /**
     * Target a property with validation rules.
     * @param property The property to target. Can be the property name or a property accessor function.
     */
    ensure(subject) {
        return this.fluentEnsure.ensure(subject);
    }
    /**
     * Targets an object with validation rules.
     */
    ensureObject() {
        return this.fluentEnsure.ensureObject();
    }
    /**
     * Rules that have been defined using the fluent API.
     */
    get rules() {
        return this.fluentEnsure.rules;
    }
    /**
     * Applies the rules to a class or object, making them discoverable by the StandardValidator.
     * @param target A class or object.
     */
    on(target) {
        return this.fluentEnsure.on(target);
    }
    ///////// FluentRules APIs /////////
    /**
     * Applies an ad-hoc rule function to the ensured property or object.
     * @param condition The function to validate the rule.
     * Will be called with two arguments, the property value and the object.
     * Should return a boolean or a Promise that resolves to a boolean.
     */
    satisfies(condition, config) {
        return this.fluentRules.satisfies(condition, config);
    }
    /**
     * Applies a rule by name.
     * @param name The name of the custom or standard rule.
     * @param args The rule's arguments.
     */
    satisfiesRule(name, ...args) {
        return this.fluentRules.satisfiesRule(name, ...args);
    }
    /**
     * Applies the "required" rule to the property.
     * The value cannot be null, undefined or whitespace.
     */
    required() {
        return this.fluentRules.required();
    }
    /**
     * Applies the "matches" rule to the property.
     * Value must match the specified regular expression.
     * null, undefined and empty-string values are considered valid.
     */
    matches(regex) {
        return this.fluentRules.matches(regex);
    }
    /**
     * Applies the "email" rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    email() {
        return this.fluentRules.email();
    }
    /**
     * Applies the "minLength" STRING validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    minLength(length) {
        return this.fluentRules.minLength(length);
    }
    /**
     * Applies the "maxLength" STRING validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    maxLength(length) {
        return this.fluentRules.maxLength(length);
    }
    /**
     * Applies the "minItems" ARRAY validation rule to the property.
     * null and undefined values are considered valid.
     */
    minItems(count) {
        return this.fluentRules.minItems(count);
    }
    /**
     * Applies the "maxItems" ARRAY validation rule to the property.
     * null and undefined values are considered valid.
     */
    maxItems(count) {
        return this.fluentRules.maxItems(count);
    }
    /**
     * Applies the "min" NUMBER validation rule to the property.
     * Value must be greater than or equal to the specified constraint.
     * null and undefined values are considered valid.
     */
    min(value) {
        return this.fluentRules.min(value);
    }
    /**
     * Applies the "max" NUMBER validation rule to the property.
     * Value must be less than or equal to the specified constraint.
     * null and undefined values are considered valid.
     */
    max(value) {
        return this.fluentRules.max(value);
    }
    /**
     * Applies the "range" NUMBER validation rule to the property.
     * Value must be between or equal to the specified min and max.
     * null and undefined values are considered valid.
     */
    range(min, max) {
        return this.fluentRules.range(min, max);
    }
    /**
     * Applies the "between" NUMBER validation rule to the property.
     * Value must be between but not equal to the specified min and max.
     * null and undefined values are considered valid.
     */
    between(min, max) {
        return this.fluentRules.between(min, max);
    }
    /**
     * Applies the "equals" validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    equals(expectedValue) {
        return this.fluentRules.equals(expectedValue);
    }
}
/**
 * Part of the fluent rule API. Enables applying rules to properties and objects.
 */
class FluentRules {
    constructor(fluentEnsure, parsers, property) {
        this.fluentEnsure = fluentEnsure;
        this.parsers = parsers;
        this.property = property;
        /**
         * Current rule sequence number. Used to postpone evaluation of rules until rules
         * with lower sequence number have successfully validated. The "then" fluent API method
         * manages this property, there's usually no need to set it directly.
         */
        this.sequence = 0;
    }
    /**
     * Sets the display name of the ensured property.
     */
    displayName(name) {
        this.property.displayName = name;
        return this;
    }
    /**
     * Applies an ad-hoc rule function to the ensured property or object.
     * @param condition The function to validate the rule.
     * Will be called with two arguments, the property value and the object.
     * Should return a boolean or a Promise that resolves to a boolean.
     */
    satisfies(condition, config) {
        return new FluentRuleCustomizer(this.property, condition, config, this.fluentEnsure, this, this.parsers);
    }
    /**
     * Applies a rule by name.
     * @param name The name of the custom or standard rule.
     * @param args The rule's arguments.
     */
    satisfiesRule(name, ...args) {
        let rule = FluentRules.customRules[name];
        if (!rule) {
            // standard rule?
            rule = this[name];
            if (rule instanceof Function) {
                return rule.call(this, ...args);
            }
            throw new Error(`Rule with name "${name}" does not exist.`);
        }
        const config = rule.argsToConfig ? rule.argsToConfig(...args) : undefined;
        return this.satisfies((value, obj) => rule.condition.call(this, value, obj, ...args), config)
            .withMessageKey(name);
    }
    /**
     * Applies the "required" rule to the property.
     * The value cannot be null, undefined or whitespace.
     */
    required() {
        return this.satisfies(value => value !== null
            && value !== undefined
            && !(isString(value) && !/\S/.test(value))).withMessageKey('required');
    }
    /**
     * Applies the "matches" rule to the property.
     * Value must match the specified regular expression.
     * null, undefined and empty-string values are considered valid.
     */
    matches(regex) {
        return this.satisfies(value => value === null || value === undefined || value.length === 0 || regex.test(value))
            .withMessageKey('matches');
    }
    /**
     * Applies the "email" rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    email() {
        // regex from https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
        /* tslint:disable:max-line-length */
        return this.matches(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
            /* tslint:enable:max-line-length */
            .withMessageKey('email');
    }
    /**
     * Applies the "minLength" STRING validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    minLength(length) {
        return this.satisfies((value) => value === null || value === undefined || value.length === 0 || value.length >= length, { length })
            .withMessageKey('minLength');
    }
    /**
     * Applies the "maxLength" STRING validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    maxLength(length) {
        return this.satisfies((value) => value === null || value === undefined || value.length === 0 || value.length <= length, { length })
            .withMessageKey('maxLength');
    }
    /**
     * Applies the "minItems" ARRAY validation rule to the property.
     * null and undefined values are considered valid.
     */
    minItems(count) {
        return this.satisfies((value) => value === null || value === undefined || value.length >= count, { count })
            .withMessageKey('minItems');
    }
    /**
     * Applies the "maxItems" ARRAY validation rule to the property.
     * null and undefined values are considered valid.
     */
    maxItems(count) {
        return this.satisfies((value) => value === null || value === undefined || value.length <= count, { count })
            .withMessageKey('maxItems');
    }
    /**
     * Applies the "min" NUMBER validation rule to the property.
     * Value must be greater than or equal to the specified constraint.
     * null and undefined values are considered valid.
     */
    min(constraint) {
        return this.satisfies((value) => value === null || value === undefined || value >= constraint, { constraint })
            .withMessageKey('min');
    }
    /**
     * Applies the "max" NUMBER validation rule to the property.
     * Value must be less than or equal to the specified constraint.
     * null and undefined values are considered valid.
     */
    max(constraint) {
        return this.satisfies((value) => value === null || value === undefined || value <= constraint, { constraint })
            .withMessageKey('max');
    }
    /**
     * Applies the "range" NUMBER validation rule to the property.
     * Value must be between or equal to the specified min and max.
     * null and undefined values are considered valid.
     */
    range(min, max) {
        return this.satisfies((value) => value === null || value === undefined || (value >= min && value <= max), { min, max })
            .withMessageKey('range');
    }
    /**
     * Applies the "between" NUMBER validation rule to the property.
     * Value must be between but not equal to the specified min and max.
     * null and undefined values are considered valid.
     */
    between(min, max) {
        return this.satisfies((value) => value === null || value === undefined || (value > min && value < max), { min, max })
            .withMessageKey('between');
    }
    /**
     * Applies the "equals" validation rule to the property.
     * null and undefined values are considered valid.
     */
    equals(expectedValue) {
        return this.satisfies(value => value === null || value === undefined || value === '' || value === expectedValue, { expectedValue })
            .withMessageKey('equals');
    }
}
FluentRules.customRules = {};
/**
 * Part of the fluent rule API. Enables targeting properties and objects with rules.
 */
class FluentEnsure {
    constructor(parsers) {
        this.parsers = parsers;
        /**
         * Rules that have been defined using the fluent API.
         */
        this.rules = [];
    }
    /**
     * Target a property with validation rules.
     * @param property The property to target. Can be the property name or a property accessor
     * function.
     */
    ensure(property) {
        this.assertInitialized();
        const name = this.parsers.property.parse(property);
        const fluentRules = new FluentRules(this, this.parsers, { name, displayName: null });
        return this.mergeRules(fluentRules, name);
    }
    /**
     * Targets an object with validation rules.
     */
    ensureObject() {
        this.assertInitialized();
        const fluentRules = new FluentRules(this, this.parsers, { name: null, displayName: null });
        return this.mergeRules(fluentRules, null);
    }
    /**
     * Applies the rules to a class or object, making them discoverable by the StandardValidator.
     * @param target A class or object.
     */
    on(target) {
        Rules.set(target, this.rules);
        return this;
    }
    /**
     * Adds a rule definition to the sequenced ruleset.
     * @internal
     */
    _addRule(rule) {
        while (this.rules.length < rule.sequence + 1) {
            this.rules.push([]);
        }
        this.rules[rule.sequence].push(rule);
    }
    assertInitialized() {
        if (this.parsers) {
            return;
        }
        throw new Error(`Did you forget to add ".plugin('aurelia-validation')" to your main.js?`);
    }
    mergeRules(fluentRules, propertyName) {
        // tslint:disable-next-line:triple-equals | Use loose equality for property keys
        const existingRules = this.rules.find(r => r.length > 0 && r[0].property.name == propertyName);
        if (existingRules) {
            const rule = existingRules[existingRules.length - 1];
            fluentRules.sequence = rule.sequence;
            if (rule.property.displayName !== null) {
                fluentRules = fluentRules.displayName(rule.property.displayName);
            }
        }
        return fluentRules;
    }
}
/**
 * Fluent rule definition API.
 */
class ValidationRules {
    static initialize(messageParser, propertyParser) {
        this.parsers = {
            message: messageParser,
            property: propertyParser
        };
    }
    /**
     * Target a property with validation rules.
     * @param property The property to target. Can be the property name or a property accessor function.
     */
    static ensure(property) {
        return new FluentEnsure(ValidationRules.parsers).ensure(property);
    }
    /**
     * Targets an object with validation rules.
     */
    static ensureObject() {
        return new FluentEnsure(ValidationRules.parsers).ensureObject();
    }
    /**
     * Defines a custom rule.
     * @param name The name of the custom rule. Also serves as the message key.
     * @param condition The rule function.
     * @param message The message expression
     * @param argsToConfig A function that maps the rule's arguments to a "config"
     * object that can be used when evaluating the message expression.
     */
    static customRule(name, condition, message, argsToConfig) {
        validationMessages[name] = message;
        FluentRules.customRules[name] = { condition, argsToConfig };
    }
    /**
     * Returns rules with the matching tag.
     * @param rules The rules to search.
     * @param tag The tag to search for.
     */
    static taggedRules(rules, tag) {
        return rules.map(x => x.filter(r => r.tag === tag));
    }
    /**
     * Returns rules that have no tag.
     * @param rules The rules to search.
     */
    static untaggedRules(rules) {
        return rules.map(x => x.filter(r => r.tag === undefined));
    }
    /**
     * Removes the rules from a class or object.
     * @param target A class or object.
     */
    static off(target) {
        Rules.unset(target);
    }
}

// Exports
/**
 * Configures the plugin.
 */
function configure(
// tslint:disable-next-line:ban-types
frameworkConfig, callback) {
    // the fluent rule definition API needs the parser to translate messages
    // to interpolation expressions.
    const messageParser = frameworkConfig.container.get(ValidationMessageParser);
    const propertyParser = frameworkConfig.container.get(PropertyAccessorParser);
    ValidationRules.initialize(messageParser, propertyParser);
    // configure...
    const config = new GlobalValidationConfiguration();
    if (callback instanceof Function) {
        callback(config);
    }
    config.apply(frameworkConfig.container);
    // globalize the behaviors.
    if (frameworkConfig.globalResources) {
        frameworkConfig.globalResources(ValidateBindingBehavior, ValidateManuallyBindingBehavior, ValidateOnBlurBindingBehavior, ValidateOnFocusoutBindingBehavior, ValidateOnChangeBindingBehavior, ValidateOnChangeOrBlurBindingBehavior, ValidateOnChangeOrFocusoutBindingBehavior, ValidationErrorsCustomAttribute, ValidationRendererCustomAttribute);
    }
}

export { configure, GlobalValidationConfiguration, getTargetDOMElement, getPropertyInfo, PropertyAccessorParser, getAccessorExpression, ValidateBindingBehavior, ValidateManuallyBindingBehavior, ValidateOnBlurBindingBehavior, ValidateOnChangeBindingBehavior, ValidateOnChangeOrBlurBindingBehavior, ValidateOnFocusoutBindingBehavior, ValidateOnChangeOrFocusoutBindingBehavior, ValidateEvent, ValidateResult, validateTrigger, ValidationController, ValidationControllerFactory, ValidationErrorsCustomAttribute, ValidationRendererCustomAttribute, Validator, Rules, StandardValidator, validationMessages, ValidationMessageProvider, ValidationMessageParser, MessageExpressionValidator, FluentRuleCustomizer, FluentRules, FluentEnsure, ValidationRules };
