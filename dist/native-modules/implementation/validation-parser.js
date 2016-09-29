var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Parser, AccessMember, AccessScope, LiteralString, Binary, Conditional, LiteralPrimitive, CallMember, Unparser } from 'aurelia-binding';
import { BindingLanguage } from 'aurelia-templating';
import { isString } from './util';
import * as LogManager from 'aurelia-logging';
export var ValidationParser = (function () {
    function ValidationParser(parser, bindinqLanguage) {
        this.parser = parser;
        this.bindinqLanguage = bindinqLanguage;
        this.emptyStringExpression = new LiteralString('');
        this.nullExpression = new LiteralPrimitive(null);
        this.undefinedExpression = new LiteralPrimitive(undefined);
        this.cache = {};
    }
    ValidationParser.prototype.coalesce = function (part) {
        // part === null || part === undefined ? '' : part
        return new Conditional(new Binary('||', new Binary('===', part, this.nullExpression), new Binary('===', part, this.undefinedExpression)), this.emptyStringExpression, new CallMember(part, 'toString', []));
    };
    ValidationParser.prototype.parseMessage = function (message) {
        if (this.cache[message] !== undefined) {
            return this.cache[message];
        }
        var parts = this.bindinqLanguage.parseInterpolation(null, message);
        if (parts === null) {
            return new LiteralString(message);
        }
        var expression = new LiteralString(parts[0]);
        for (var i = 1; i < parts.length; i += 2) {
            expression = new Binary('+', expression, new Binary('+', this.coalesce(parts[i]), new LiteralString(parts[i + 1])));
        }
        MessageExpressionValidator.validate(expression, message);
        this.cache[message] = expression;
        return expression;
    };
    ValidationParser.prototype.getAccessorExpression = function (fn) {
        var classic = /^function\s*\([$_\w\d]+\)\s*\{\s*(?:"use strict";)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
        var arrow = /^[$_\w\d]+\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
        var match = classic.exec(fn) || arrow.exec(fn);
        if (match === null) {
            throw new Error("Unable to parse accessor function:\n" + fn);
        }
        return this.parser.parse(match[1]);
    };
    ValidationParser.prototype.parseProperty = function (property) {
        if (isString(property)) {
            return { name: property, displayName: null };
        }
        var accessor = this.getAccessorExpression(property.toString());
        if (accessor instanceof AccessScope
            || accessor instanceof AccessMember && accessor.object instanceof AccessScope) {
            return {
                name: accessor.name,
                displayName: null
            };
        }
        throw new Error("Invalid subject: \"" + accessor + "\"");
    };
    ValidationParser.inject = [Parser, BindingLanguage];
    return ValidationParser;
}());
export var MessageExpressionValidator = (function (_super) {
    __extends(MessageExpressionValidator, _super);
    function MessageExpressionValidator(originalMessage) {
        _super.call(this, []);
        this.originalMessage = originalMessage;
    }
    MessageExpressionValidator.validate = function (expression, originalMessage) {
        var visitor = new MessageExpressionValidator(originalMessage);
        expression.accept(visitor);
    };
    MessageExpressionValidator.prototype.visitAccessScope = function (access) {
        if (access.ancestor !== 0) {
            throw new Error('$parent is not permitted in validation message expressions.');
        }
        if (['displayName', 'propertyName', 'value', 'object', 'config', 'getDisplayName'].indexOf(access.name) !== -1) {
            LogManager.getLogger('aurelia-validation')
                .warn("Did you mean to use \"$" + access.name + "\" instead of \"" + access.name + "\" in this validation message template: \"" + this.originalMessage + "\"?");
        }
    };
    return MessageExpressionValidator;
}(Unparser));
