import {
  Parser,
  Expression,
  AccessMember,
  AccessScope,
  LiteralString,
  Binary,
  Conditional,
  LiteralPrimitive,
  CallMember,
  Unparser
} from 'aurelia-binding';
import { BindingLanguage } from 'aurelia-templating';
import { RuleProperty } from './rule';
import { isString } from './util';

import * as LogManager from 'aurelia-logging';

export interface PropertyAccessor<TObject, TValue> {
  (object: TObject): TValue;
}

export class ValidationParser {
  public static inject = [Parser, BindingLanguage];

  private emptyStringExpression = new LiteralString('');
  private nullExpression = new LiteralPrimitive(null);
  private undefinedExpression = new LiteralPrimitive(undefined);
  private cache: { [message: string]: Expression } = {};

  constructor(private parser: Parser, private bindinqLanguage: BindingLanguage) { }

  public parseMessage(message: string): Expression {
    if (this.cache[message] !== undefined) {
      return this.cache[message];
    }

    const parts: (Expression | string)[] | null = (<any>this.bindinqLanguage).parseInterpolation(null, message);
    if (parts === null) {
      return new LiteralString(message);
    }
    let expression: Expression = new LiteralString(<string>parts[0]);
    for (let i = 1; i < parts.length; i += 2) {
      expression = new Binary(
        '+',
        expression,
        new Binary(
          '+',
          this.coalesce(<Expression>parts[i]),
          new LiteralString(<string>parts[i + 1])
        )
      );
    }

    MessageExpressionValidator.validate(expression, message);

    this.cache[message] = expression;

    return expression;
  }

  public parseProperty<TObject, TValue>(property: string | PropertyAccessor<TObject, TValue>): RuleProperty {
    if (isString(property)) {
      return { name: <string>property, displayName: null };
    }
    const accessor = this.getAccessorExpression(property.toString());
    if (accessor instanceof AccessScope
      || accessor instanceof AccessMember && accessor.object instanceof AccessScope) {
      return {
        name: accessor.name,
        displayName: null
      };
    }
    throw new Error(`Invalid subject: "${accessor}"`);
  }

  private coalesce(part: Expression): Expression {
    // part === null || part === undefined ? '' : part
    return new Conditional(
      new Binary(
        '||',
        new Binary('===', part, this.nullExpression),
        new Binary('===', part, this.undefinedExpression)
      ),
      this.emptyStringExpression,
      new CallMember(part, 'toString', [])
    );
  }

  private getAccessorExpression(fn: string): Expression {
    const classic = /^function\s*\([$_\w\d]+\)\s*\{\s*(?:"use strict";)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
    const arrow = /^\(?[$_\w\d]+\)?\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
    const match = classic.exec(fn) || arrow.exec(fn);
    if (match === null) {
      throw new Error(`Unable to parse accessor function:\n${fn}`);
    }
    return this.parser.parse(match[1]);
  }
}

export class MessageExpressionValidator extends Unparser {
  public static validate(expression: Expression, originalMessage: string) {
    const visitor = new MessageExpressionValidator(originalMessage);
    expression.accept(visitor);
  }

  constructor(private originalMessage: string) {
    super([]);
  }

  public visitAccessScope(access: AccessScope) {
    if (access.ancestor !== 0) {
      throw new Error('$parent is not permitted in validation message expressions.');
    }
    if (['displayName', 'propertyName', 'value', 'object', 'config', 'getDisplayName'].indexOf(access.name) !== -1) {
      LogManager.getLogger('aurelia-validation')
        /* tslint:disable:max-line-length */
        .warn(`Did you mean to use "$${access.name}" instead of "${access.name}" in this validation message template: "${this.originalMessage}"?`);
      /* tslint:enable:max-line-length */
    }
  }
}
