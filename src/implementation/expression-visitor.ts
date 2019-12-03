import {
  Expression,
  ValueConverter,
  Conditional,
  AccessScope,
  AccessMember,
  AccessKeyed,
  CallMember,
  BindingBehavior,
  Binary,
  LiteralPrimitive,
  LiteralString
} from 'aurelia-binding';

// tslint:disable:no-empty
export class ExpressionVisitor {
  public visitChain(chain: any) {
    this.visitArgs(chain.expressions);
  }

  public visitBindingBehavior(behavior: BindingBehavior) {
    behavior.expression.accept(this);
    this.visitArgs(behavior.args);
  }

  public visitValueConverter(converter: ValueConverter) {
    converter.expression.accept(this);
    this.visitArgs(converter.args);
  }

  public visitAssign(assign: any) {
    assign.target.accept(this);
    assign.value.accept(this);
  }

  public visitConditional(conditional: Conditional) {
    conditional.condition.accept(this);
    conditional.yes.accept(this);
    conditional.no.accept(this);
  }

  public visitAccessThis(access: any) {
    access.ancestor = access.ancestor;
  }

  public visitAccessScope(access: AccessScope) {
    access.name = access.name;
  }

  public visitAccessMember(access: AccessMember) {
    access.object.accept(this);
  }

  public visitAccessKeyed(access: AccessKeyed) {
    access.object.accept(this);
    access.key.accept(this);
  }

  public visitCallScope(call: any) {
    this.visitArgs(call.args);
  }

  public visitCallFunction(call: any) {
    call.func.accept(this);
    this.visitArgs(call.args);
  }

  public visitCallMember(call: CallMember) {
    call.object.accept(this);
    this.visitArgs(call.args);
  }

  public visitPrefix(prefix: any) {
    prefix.expression.accept(this);
  }

  public visitBinary(binary: Binary) {
    binary.left.accept(this);
    binary.right.accept(this);
  }

  public visitLiteralPrimitive(literal: LiteralPrimitive) {
    literal.value = literal.value;
  }

  public visitLiteralArray(literal: any) {
    this.visitArgs(literal.elements);
  }

  public visitLiteralObject(literal: any) {
    this.visitArgs(literal.values);
  }

  public visitLiteralString(literal: LiteralString) {
    literal.value = literal.value;
  }

  private visitArgs(args: Expression[]) {
    for (let i = 0; i < args.length; i++) {
      args[i].accept(this);
    }
  }
}
