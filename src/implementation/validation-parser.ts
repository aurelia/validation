import {
  Parser,
  Expression,
  AccessMember,
  AccessScope,
  LiteralString,
  Binary,
  Conditional,
  LiteralPrimitive,
  CallMember
} from 'aurelia-binding';
import {BindingLanguage} from 'aurelia-templating';
import {RuleProperty} from './rule';
import {isString} from './util';

export interface PropertyAccessor<TObject, TValue> {
  (object: TObject): TValue;
}

export class ValidationParser {
  static inject = [Parser, BindingLanguage];

  private emptyStringExpression = new LiteralString('');
  private nullExpression = new LiteralPrimitive(null);
  private undefinedExpression = new LiteralPrimitive(undefined);

  constructor(private parser: Parser, private bindinqLanguage: BindingLanguage) {}

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

  parseMessage(message: string): Expression {
    const parts: (Expression|string)[]|null = (<any>this.bindinqLanguage).parseInterpolation(null, message);
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
    return expression;
  }

  private getFunctionBody(f: Function): string {
    function removeCommentsFromSource(str: string): string {
      return str.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '$1');
    }
    let s = removeCommentsFromSource(f.toString());
    return s.substring(s.indexOf('{') + 1, s.lastIndexOf('}'));
  }

  private getAccessorExpression(f: Function): Expression {
    let body = this.getFunctionBody(f).trim();
    body = body.replace(/^['"]use strict['"];/, '').trim();
    body = body.substr('return'.length).trim();
    body = body.replace(/;$/, '');
    return this.parser.parse(body);
  }

  parseProperty<TObject, TValue>(property: string|PropertyAccessor<TObject, TValue>): RuleProperty {
    let accessor: Expression;
    if (isString(property)) {
      accessor = this.parser.parse(<string>property);
    } else {
      accessor = this.getAccessorExpression(<Function>property);
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
