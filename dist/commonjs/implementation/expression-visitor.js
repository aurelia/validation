"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-empty
var ExpressionVisitor = /** @class */ (function () {
    function ExpressionVisitor() {
    }
    ExpressionVisitor.prototype.visitChain = function (chain) {
        this.visitArgs(chain.expressions);
    };
    ExpressionVisitor.prototype.visitBindingBehavior = function (behavior) {
        behavior.expression.accept(this);
        this.visitArgs(behavior.args);
    };
    ExpressionVisitor.prototype.visitValueConverter = function (converter) {
        converter.expression.accept(this);
        this.visitArgs(converter.args);
    };
    ExpressionVisitor.prototype.visitAssign = function (assign) {
        assign.target.accept(this);
        assign.value.accept(this);
    };
    ExpressionVisitor.prototype.visitConditional = function (conditional) {
        conditional.condition.accept(this);
        conditional.yes.accept(this);
        conditional.no.accept(this);
    };
    ExpressionVisitor.prototype.visitAccessThis = function (access) {
        access.ancestor = access.ancestor;
    };
    ExpressionVisitor.prototype.visitAccessScope = function (access) {
        access.name = access.name;
    };
    ExpressionVisitor.prototype.visitAccessMember = function (access) {
        access.object.accept(this);
    };
    ExpressionVisitor.prototype.visitAccessKeyed = function (access) {
        access.object.accept(this);
        access.key.accept(this);
    };
    ExpressionVisitor.prototype.visitCallScope = function (call) {
        this.visitArgs(call.args);
    };
    ExpressionVisitor.prototype.visitCallFunction = function (call) {
        call.func.accept(this);
        this.visitArgs(call.args);
    };
    ExpressionVisitor.prototype.visitCallMember = function (call) {
        call.object.accept(this);
        this.visitArgs(call.args);
    };
    ExpressionVisitor.prototype.visitPrefix = function (prefix) {
        prefix.expression.accept(this);
    };
    ExpressionVisitor.prototype.visitBinary = function (binary) {
        binary.left.accept(this);
        binary.right.accept(this);
    };
    ExpressionVisitor.prototype.visitLiteralPrimitive = function (literal) {
        literal.value = literal.value;
    };
    ExpressionVisitor.prototype.visitLiteralArray = function (literal) {
        this.visitArgs(literal.elements);
    };
    ExpressionVisitor.prototype.visitLiteralObject = function (literal) {
        this.visitArgs(literal.values);
    };
    ExpressionVisitor.prototype.visitLiteralString = function (literal) {
        literal.value = literal.value;
    };
    ExpressionVisitor.prototype.visitArgs = function (args) {
        for (var i = 0; i < args.length; i++) {
            args[i].accept(this);
        }
    };
    return ExpressionVisitor;
}());
exports.ExpressionVisitor = ExpressionVisitor;
