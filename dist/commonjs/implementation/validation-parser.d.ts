import { Parser, Expression, AccessScope, Unparser } from 'aurelia-binding';
import { BindingLanguage } from 'aurelia-templating';
import { RuleProperty } from './rule';
export interface PropertyAccessor<TObject, TValue> {
    (object: TObject): TValue;
}
export declare class ValidationParser {
    private parser;
    private bindinqLanguage;
    static inject: (typeof Parser | typeof BindingLanguage)[];
    private emptyStringExpression;
    private nullExpression;
    private undefinedExpression;
    private cache;
    constructor(parser: Parser, bindinqLanguage: BindingLanguage);
    private coalesce(part);
    parseMessage(message: string): Expression;
    private getAccessorExpression(fn);
    parseProperty<TObject, TValue>(property: string | PropertyAccessor<TObject, TValue>): RuleProperty;
}
export declare class MessageExpressionValidator extends Unparser {
    private originalMessage;
    static validate(expression: Expression, originalMessage: string): void;
    constructor(originalMessage: string);
    visitAccessScope(access: AccessScope): void;
}
