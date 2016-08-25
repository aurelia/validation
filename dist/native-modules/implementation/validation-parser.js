import { Parser, AccessMember, AccessScope, LiteralString, Binary, Conditional, LiteralPrimitive, CallMember } from 'aurelia-binding';
import { BindingLanguage } from 'aurelia-templating';
import { isString } from './util';
export var ValidationParser = (function () {
    function ValidationParser(parser, bindinqLanguage) {
        this.parser = parser;
        this.bindinqLanguage = bindinqLanguage;
        this.emptyStringExpression = new LiteralString('');
        this.nullExpression = new LiteralPrimitive(null);
        this.undefinedExpression = new LiteralPrimitive(undefined);
    }
    ValidationParser.prototype.coalesce = function (part) {
        // part === null || part === undefined ? '' : part
        return new Conditional(new Binary('||', new Binary('===', part, this.nullExpression), new Binary('===', part, this.undefinedExpression)), this.emptyStringExpression, new CallMember(part, 'toString', []));
    };
    ValidationParser.prototype.parseMessage = function (message) {
        var parts = this.bindinqLanguage.parseInterpolation(null, message);
        if (parts === null) {
            return new LiteralString(message);
        }
        var expression = new LiteralString(parts[0]);
        for (var i = 1; i < parts.length; i += 2) {
            expression = new Binary('+', expression, new Binary('+', this.coalesce(parts[i]), new LiteralString(parts[i + 1])));
        }
        return expression;
    };
    ValidationParser.prototype.getFunctionBody = function (f) {
        function removeCommentsFromSource(str) {
            return str.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '$1');
        }
        var s = removeCommentsFromSource(f.toString());
        return s.substring(s.indexOf('{') + 1, s.lastIndexOf('}'));
    };
    ValidationParser.prototype.getAccessorExpression = function (f) {
        var body = this.getFunctionBody(f).trim();
        body = body.replace(/^['"]use strict['"];/, '').trim();
        body = body.substr('return'.length).trim();
        body = body.replace(/;$/, '');
        return this.parser.parse(body);
    };
    ValidationParser.prototype.parseProperty = function (property) {
        var accessor;
        if (isString(property)) {
            accessor = this.parser.parse(property);
        }
        else {
            accessor = this.getAccessorExpression(property);
        }
        if (accessor instanceof AccessMember && accessor.object instanceof AccessScope) {
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
