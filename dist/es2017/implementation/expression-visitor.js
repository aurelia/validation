// tslint:disable:no-empty
export class ExpressionVisitor {
    visitChain(chain) {
        this.visitArgs(chain.expressions);
    }
    visitBindingBehavior(behavior) {
        behavior.expression.accept(this);
        this.visitArgs(behavior.args);
    }
    visitValueConverter(converter) {
        converter.expression.accept(this);
        this.visitArgs(converter.args);
    }
    visitAssign(assign) {
        assign.target.accept(this);
        assign.value.accept(this);
    }
    visitConditional(conditional) {
        conditional.condition.accept(this);
        conditional.yes.accept(this);
        conditional.no.accept(this);
    }
    visitAccessThis(access) {
        access.ancestor = access.ancestor;
    }
    visitAccessScope(access) {
        access.name = access.name;
    }
    visitAccessMember(access) {
        access.object.accept(this);
    }
    visitAccessKeyed(access) {
        access.object.accept(this);
        access.key.accept(this);
    }
    visitCallScope(call) {
        this.visitArgs(call.args);
    }
    visitCallFunction(call) {
        call.func.accept(this);
        this.visitArgs(call.args);
    }
    visitCallMember(call) {
        call.object.accept(this);
        this.visitArgs(call.args);
    }
    visitPrefix(prefix) {
        prefix.expression.accept(this);
    }
    visitBinary(binary) {
        binary.left.accept(this);
        binary.right.accept(this);
    }
    visitLiteralPrimitive(literal) {
        literal.value = literal.value;
    }
    visitLiteralArray(literal) {
        this.visitArgs(literal.elements);
    }
    visitLiteralObject(literal) {
        this.visitArgs(literal.values);
    }
    visitLiteralString(literal) {
        literal.value = literal.value;
    }
    visitArgs(args) {
        for (let i = 0; i < args.length; i++) {
            args[i].accept(this);
        }
    }
}
