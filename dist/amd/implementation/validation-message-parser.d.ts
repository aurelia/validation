import { Expression, AccessScope } from 'aurelia-binding';
import { BindingLanguage } from 'aurelia-templating';
import { ExpressionVisitor } from './expression-visitor';
export declare class ValidationMessageParser {
    private bindinqLanguage;
    static inject: (typeof BindingLanguage)[];
    private emptyStringExpression;
    private nullExpression;
    private undefinedExpression;
    private cache;
    constructor(bindinqLanguage: BindingLanguage);
    parse(message: string): Expression;
    private coalesce(part);
}
export declare class MessageExpressionValidator extends ExpressionVisitor {
    private originalMessage;
    static validate(expression: Expression, originalMessage: string): void;
    constructor(originalMessage: string);
    visitAccessScope(access: AccessScope): void;
}
