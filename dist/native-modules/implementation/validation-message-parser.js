var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { LiteralString, Binary, Conditional, LiteralPrimitive, CallMember } from 'aurelia-binding';
import { BindingLanguage } from 'aurelia-templating';
import * as LogManager from 'aurelia-logging';
import { ExpressionVisitor } from './expression-visitor';
var ValidationMessageParser = /** @class */ (function () {
    function ValidationMessageParser(bindinqLanguage) {
        this.bindinqLanguage = bindinqLanguage;
        this.emptyStringExpression = new LiteralString('');
        this.nullExpression = new LiteralPrimitive(null);
        this.undefinedExpression = new LiteralPrimitive(undefined);
        this.cache = {};
    }
    ValidationMessageParser.prototype.parse = function (message) {
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
    ValidationMessageParser.prototype.coalesce = function (part) {
        // part === null || part === undefined ? '' : part
        return new Conditional(new Binary('||', new Binary('===', part, this.nullExpression), new Binary('===', part, this.undefinedExpression)), this.emptyStringExpression, new CallMember(part, 'toString', []));
    };
    ValidationMessageParser.inject = [BindingLanguage];
    return ValidationMessageParser;
}());
export { ValidationMessageParser };
var MessageExpressionValidator = /** @class */ (function (_super) {
    __extends(MessageExpressionValidator, _super);
    function MessageExpressionValidator(originalMessage) {
        var _this = _super.call(this) || this;
        _this.originalMessage = originalMessage;
        return _this;
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
}(ExpressionVisitor));
export { MessageExpressionValidator };
