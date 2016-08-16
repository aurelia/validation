import {
  Parser,
  Expression,
  AccessThis,
  AccessMember,
  LiteralString,
  Binary,
  Conditional,
  LiteralPrimative,
  CallMember
} from 'aurelia-binding';
import {BindingLanguage} from 'aurelia-templating';
import {Subject} from './rule';
import {isString} from './util';

export class ValidationParser {
  static inject = [Parser, BindingLanguage];

  private thisExpression = new AccessThis(0);
  private emptyStringExpression = new LiteralString('');
  private nullExpression = new LiteralPrimative(null);
  private undefinedExpression = new LiteralPrimative(undefined);

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
    let expression: Expression = new LiteralString(parts[0]);
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

  private getAccessorExpression(f: { (obj: any): any; }): Expression {
    let body = this.getFunctionBody(f).trim();
    body = body.replace(/^['"]use strict['"];/, '').trim();
    body = body.substr('return'.length).trim();
    body = body.replace(/;$/, '');
    return this.parser.parse(body);
  }

  parseSubject<TModel, TValue>(subject: string|{ (obj: TModel): TValue; }): Subject {
    let accessor: Expression;
    if (isString(subject)) {
      accessor = this.parser.parse(<string>subject);
    } else {
      accessor = this.getAccessorExpression(<{ (obj: TModel): TValue; }>subject);
    }
    if (accessor instanceof AccessMember) {      
      return {
        value: accessor,
        object: accessor.object,
        model: this.thisExpression,
        propertyName: accessor.name,
        displayName: null
      };
    }
    throw new Error(`Invalid subject: "${accessor}"`);
  }
}
