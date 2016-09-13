import { Parser, AccessMember, AccessScope, LiteralString, Binary, Conditional, LiteralPrimitive, CallMember, Unparser } from 'aurelia-binding';
import { BindingLanguage } from 'aurelia-templating';
import { isString } from './util';
import * as LogManager from 'aurelia-logging';
export class ValidationParser {
    constructor(parser, bindinqLanguage) {
        this.parser = parser;
        this.bindinqLanguage = bindinqLanguage;
        this.emptyStringExpression = new LiteralString('');
        this.nullExpression = new LiteralPrimitive(null);
        this.undefinedExpression = new LiteralPrimitive(undefined);
        this.cache = {};
    }
    coalesce(part) {
        // part === null || part === undefined ? '' : part
        return new Conditional(new Binary('||', new Binary('===', part, this.nullExpression), new Binary('===', part, this.undefinedExpression)), this.emptyStringExpression, new CallMember(part, 'toString', []));
    }
    parseMessage(message) {
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
    getAccessorExpression(fn) {
        const classic = /^function\s*\([$_\w\d]+\)\s*\{\s*(?:"use strict";)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
        const arrow = /^[$_\w\d]+\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
        const match = classic.exec(fn) || arrow.exec(fn);
        if (match === null) {
            throw new Error(`Unable to parse accessor function:\n${fn}`);
        }
        return this.parser.parse(match[1]);
    }
    parseProperty(property) {
        let accessor;
        if (isString(property)) {
            accessor = this.parser.parse(property);
        }
        else {
            accessor = this.getAccessorExpression(property.toString());
        }
        if (accessor instanceof AccessScope
            || accessor instanceof AccessMember && accessor.object instanceof AccessScope) {
            return {
                name: accessor.name,
                displayName: null
            };
        }
        throw new Error(`Invalid subject: "${accessor}"`);
    }
}
ValidationParser.inject = [Parser, BindingLanguage];
export class MessageExpressionValidator extends Unparser {
    constructor(originalMessage) {
        super([]);
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
            LogManager.getLogger('aurelia-validation')
                .warn(`Did you mean to use "$${access.name}" instead of "${access.name}" in this validation message template: "${this.originalMessage}"?`);
        }
    }
}
