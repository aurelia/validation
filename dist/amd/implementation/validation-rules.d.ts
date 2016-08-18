import { Rule, RuleProperty } from './rule';
import { ValidationParser, PropertyAccessor } from './validation-parser';
export declare const $all: number;
export declare class FluentRuleCustomizer<TObject, TValue> {
    private fluentEnsure;
    private fluentRules;
    private parser;
    private rule;
    constructor(property: RuleProperty, condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config: Object, fluentEnsure: FluentEnsure<TObject>, fluentRules: FluentRules<TObject, TValue>, parser: ValidationParser);
    withMessageKey(key: string): this;
    withMessage(message: string): this;
    when(condition: (object: TObject) => boolean): this;
    /** Builder1 APIs **/
    ensure<TValue2>(subject: string | {
        (model: TObject): TValue2;
    }): FluentRules<TObject, TValue2>;
    ensureObject(): FluentRules<TObject, TObject>;
    readonly rules: Rule<TObject, any>[];
    on(target: any): FluentEnsure<TObject>;
    /** Builder2 APIs **/
    satisfies(condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config?: Object): FluentRuleCustomizer<TObject, TValue>;
    required(): FluentRuleCustomizer<TObject, TValue>;
    matches(regex: RegExp): FluentRuleCustomizer<TObject, TValue>;
    email(): FluentRuleCustomizer<TObject, TValue>;
    minLength(length: number): FluentRuleCustomizer<TObject, TValue>;
    maxLength(length: number): FluentRuleCustomizer<TObject, TValue>;
    minItems(count: number): FluentRuleCustomizer<TObject, TValue>;
    maxItems(count: number): FluentRuleCustomizer<TObject, TValue>;
}
export declare class FluentRules<TObject, TValue> {
    private fluentEnsure;
    private parser;
    private property;
    constructor(fluentEnsure: FluentEnsure<TObject>, parser: ValidationParser, property: RuleProperty);
    displayName(name: string): this;
    satisfies(condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config?: Object): FluentRuleCustomizer<TObject, TValue>;
    required(): FluentRuleCustomizer<TObject, TValue>;
    matches(regex: RegExp): FluentRuleCustomizer<TObject, TValue>;
    email(): FluentRuleCustomizer<TObject, TValue>;
    minLength(length: number): FluentRuleCustomizer<TObject, TValue>;
    maxLength(length: number): FluentRuleCustomizer<TObject, TValue>;
    minItems(count: number): FluentRuleCustomizer<TObject, TValue>;
    maxItems(count: number): FluentRuleCustomizer<TObject, TValue>;
}
export declare class FluentEnsure<TObject> {
    private parser;
    rules: Rule<TObject, any>[];
    constructor(parser: ValidationParser);
    ensure<TValue>(property: string | PropertyAccessor<TObject, TValue>): FluentRules<TObject, TValue>;
    ensureObject(): FluentRules<TObject, TObject>;
    on(target: any): this;
    private assertInitialized();
}
export declare class ValidationRules {
    private static parser;
    static initialize(parser: ValidationParser): void;
    static ensure<TObject, TValue>(property: string | PropertyAccessor<TObject, TValue>): FluentRules<TObject, TValue>;
    static ensureObject<TObject>(): FluentRules<TObject, TObject>;
}
