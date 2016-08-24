import { Parser, Expression } from 'aurelia-binding';
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
    constructor(parser: Parser, bindinqLanguage: BindingLanguage);
    private coalesce(part);
    parseMessage(message: string): Expression;
    private getFunctionBody(f);
    private getAccessorExpression(f);
    parseProperty<TObject, TValue>(property: string | PropertyAccessor<TObject, TValue>): RuleProperty;
}
