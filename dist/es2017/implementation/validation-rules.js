import { Rules } from './rules';
import { validationMessages } from './validation-messages';
import { isString } from '../util';
/**
 * Part of the fluent rule API. Enables customizing property rules.
 */
export class FluentRuleCustomizer {
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
export class FluentRules {
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
export class FluentEnsure {
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
        const existingRules = this.rules.find(r => r.length > 0 && r[0].property.name === propertyName);
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
export class ValidationRules {
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
