import { Rule, RuleProperty, ValidationDisplayNameAccessor } from './rule';
import { ValidationMessageParser } from './validation-message-parser';
import { PropertyAccessorParser, PropertyAccessor } from '../property-accessor-parser';
/**
 * Part of the fluent rule API. Enables customizing property rules.
 */
export declare class FluentRuleCustomizer<TObject, TValue> {
    private fluentEnsure;
    private fluentRules;
    private parsers;
    private rule;
    constructor(property: RuleProperty, condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config: object | undefined, fluentEnsure: FluentEnsure<TObject>, fluentRules: FluentRules<TObject, TValue>, parsers: Parsers);
    /**
     * Validate subsequent rules after previously declared rules have
     * been validated successfully. Use to postpone validation of costly
     * rules until less expensive rules pass validation.
     */
    then(): this;
    /**
     * Specifies the key to use when looking up the rule's validation message.
     */
    withMessageKey(key: string): this;
    /**
     * Specifies rule's validation message.
     */
    withMessage(message: string): this;
    /**
     * Specifies a condition that must be met before attempting to validate the rule.
     * @param condition A function that accepts the object as a parameter and returns true
     * or false whether the rule should be evaluated.
     */
    when(condition: (object: TObject) => boolean): this;
    /**
     * Tags the rule instance, enabling the rule to be found easily
     * using ValidationRules.taggedRules(rules, tag)
     */
    tag(tag: string): this;
    /**
     * Target a property with validation rules.
     * @param property The property to target. Can be the property name or a property accessor function.
     */
    ensure<TValue2>(subject: string | ((model: TObject) => TValue2)): FluentRules<TObject, any>;
    /**
     * Targets an object with validation rules.
     */
    ensureObject(): FluentRules<TObject, any>;
    /**
     * Rules that have been defined using the fluent API.
     */
    readonly rules: Rule<TObject, any>[][];
    /**
     * Applies the rules to a class or object, making them discoverable by the StandardValidator.
     * @param target A class or object.
     */
    on(target: any): FluentEnsure<TObject>;
    /**
     * Applies an ad-hoc rule function to the ensured property or object.
     * @param condition The function to validate the rule.
     * Will be called with two arguments, the property value and the object.
     * Should return a boolean or a Promise that resolves to a boolean.
     */
    satisfies(condition: (value: TValue, object: TObject) => boolean | Promise<boolean>, config?: object): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies a rule by name.
     * @param name The name of the custom or standard rule.
     * @param args The rule's arguments.
     */
    satisfiesRule(name: string, ...args: any[]): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "required" rule to the property.
     * The value cannot be null, undefined or whitespace.
     */
    required(): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "matches" rule to the property.
     * Value must match the specified regular expression.
     * null, undefined and empty-string values are considered valid.
     */
    matches(regex: RegExp): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "email" rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    email(): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "minLength" STRING validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    minLength(length: number): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "maxLength" STRING validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    maxLength(length: number): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "minItems" ARRAY validation rule to the property.
     * null and undefined values are considered valid.
     */
    minItems(count: number): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "maxItems" ARRAY validation rule to the property.
     * null and undefined values are considered valid.
     */
    maxItems(count: number): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "equals" validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    equals(expectedValue: TValue): FluentRuleCustomizer<TObject, TValue>;
}
/**
 * Part of the fluent rule API. Enables applying rules to properties and objects.
 */
export declare class FluentRules<TObject, TValue> {
    private fluentEnsure;
    private parsers;
    private property;
    static customRules: {
        [name: string]: {
            condition: (value: any, object?: any, ...fluentArgs: any[]) => boolean | Promise<boolean>;
            argsToConfig?: (...args: any[]) => any;
        };
    };
    /**
     * Current rule sequence number. Used to postpone evaluation of rules until rules
     * with lower sequence number have successfully validated. The "then" fluent API method
     * manages this property, there's usually no need to set it directly.
     */
    sequence: number;
    constructor(fluentEnsure: FluentEnsure<TObject>, parsers: Parsers, property: RuleProperty);
    /**
     * Sets the display name of the ensured property.
     */
    displayName(name: string | ValidationDisplayNameAccessor | null): this;
    /**
     * Applies an ad-hoc rule function to the ensured property or object.
     * @param condition The function to validate the rule.
     * Will be called with two arguments, the property value and the object.
     * Should return a boolean or a Promise that resolves to a boolean.
     */
    satisfies(condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config?: object): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies a rule by name.
     * @param name The name of the custom or standard rule.
     * @param args The rule's arguments.
     */
    satisfiesRule(name: string, ...args: any[]): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "required" rule to the property.
     * The value cannot be null, undefined or whitespace.
     */
    required(): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "matches" rule to the property.
     * Value must match the specified regular expression.
     * null, undefined and empty-string values are considered valid.
     */
    matches(regex: RegExp): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "email" rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    email(): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "minLength" STRING validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    minLength(length: number): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "maxLength" STRING validation rule to the property.
     * null, undefined and empty-string values are considered valid.
     */
    maxLength(length: number): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "minItems" ARRAY validation rule to the property.
     * null and undefined values are considered valid.
     */
    minItems(count: number): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "maxItems" ARRAY validation rule to the property.
     * null and undefined values are considered valid.
     */
    maxItems(count: number): FluentRuleCustomizer<TObject, TValue>;
    /**
     * Applies the "equals" validation rule to the property.
     * null and undefined values are considered valid.
     */
    equals(expectedValue: TValue): FluentRuleCustomizer<TObject, TValue>;
}
/**
 * Part of the fluent rule API. Enables targeting properties and objects with rules.
 */
export declare class FluentEnsure<TObject> {
    private parsers;
    /**
     * Rules that have been defined using the fluent API.
     */
    rules: Rule<TObject, any>[][];
    constructor(parsers: Parsers);
    /**
     * Target a property with validation rules.
     * @param property The property to target. Can be the property name or a property accessor
     * function.
     */
    ensure<TValue>(property: string | PropertyAccessor<TObject, TValue>): FluentRules<TObject, any>;
    /**
     * Targets an object with validation rules.
     */
    ensureObject(): FluentRules<TObject, any>;
    /**
     * Applies the rules to a class or object, making them discoverable by the StandardValidator.
     * @param target A class or object.
     */
    on(target: any): this;
    private assertInitialized();
    private mergeRules(fluentRules, propertyName);
}
/**
 * Fluent rule definition API.
 */
export declare class ValidationRules {
    private static parsers;
    static initialize(messageParser: ValidationMessageParser, propertyParser: PropertyAccessorParser): void;
    /**
     * Target a property with validation rules.
     * @param property The property to target. Can be the property name or a property accessor function.
     */
    static ensure<TObject, TValue>(property: string | PropertyAccessor<TObject, TValue>): FluentRules<TObject, any>;
    /**
     * Targets an object with validation rules.
     */
    static ensureObject<TObject>(): FluentRules<TObject, any>;
    /**
     * Defines a custom rule.
     * @param name The name of the custom rule. Also serves as the message key.
     * @param condition The rule function.
     * @param message The message expression
     * @param argsToConfig A function that maps the rule's arguments to a "config"
     * object that can be used when evaluating the message expression.
     */
    static customRule(name: string, condition: (value: any, object?: any, ...args: any[]) => boolean | Promise<boolean>, message: string, argsToConfig?: (...args: any[]) => any): void;
    /**
     * Returns rules with the matching tag.
     * @param rules The rules to search.
     * @param tag The tag to search for.
     */
    static taggedRules(rules: Rule<any, any>[][], tag: string): Rule<any, any>[][];
    /**
     * Returns rules that have no tag.
     * @param rules The rules to search.
     */
    static untaggedRules(rules: Rule<any, any>[][]): Rule<any, any>[][];
    /**
     * Removes the rules from a class or object.
     * @param target A class or object.
     */
    static off(target: any): void;
}
export interface Parsers {
    message: ValidationMessageParser;
    property: PropertyAccessorParser;
}
