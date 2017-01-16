import { Expression, AccessScope } from 'aurelia-binding';
import { Container } from 'aurelia-dependency-injection';
import { BindingLanguage } from 'aurelia-templating';
import { TemplatingBindingLanguage } from 'aurelia-templating-binding';
import { ValidationParser } from '../src/aurelia-validation';

describe('Validator', () => {
  let parser: ValidationParser;

  beforeAll(() => {
    const container = new Container();
    container.registerInstance(BindingLanguage, container.get(TemplatingBindingLanguage));
    parser = container.get(ValidationParser);
  });

  it('parses function bodies', () => {
    const parse: (fn: string) => Expression = (parser as any).getAccessorExpression.bind(parser);
    expect(parse('function(a){return a.b}')).toEqual(new AccessScope('b', 0));
    expect(parse('function(a){return a.b;}')).toEqual(new AccessScope('b', 0));
    expect(parse('function (a){return a.b;}')).toEqual(new AccessScope('b', 0));
    expect(parse('function(a) {return a.b;}')).toEqual(new AccessScope('b', 0));
    expect(parse('function (a) { return a.b; }')).toEqual(new AccessScope('b', 0));
    expect(parse('function (a1) { return a1.bcde; }')).toEqual(new AccessScope('bcde', 0));
    expect(parse('function ($a1) { return $a1.bcde; }')).toEqual(new AccessScope('bcde', 0));
    expect(parse('function (_) { return _.bc_de; }')).toEqual(new AccessScope('bc_de', 0));
    expect(parse('function (a) {"use strict"; return a.b; }')).toEqual(new AccessScope('b', 0));
    expect(parse('function (a) { "use strict";  return a.b; }')).toEqual(new AccessScope('b', 0));
    expect(parse('a=>a.b')).toEqual(new AccessScope('b', 0));
    expect(parse('a =>a.b')).toEqual(new AccessScope('b', 0));
    expect(parse('a=> a.b')).toEqual(new AccessScope('b', 0));
    expect(parse('a => a.b')).toEqual(new AccessScope('b', 0));
    expect(parse('a => a.bcde')).toEqual(new AccessScope('bcde', 0));
    expect(parse('_ => _.b')).toEqual(new AccessScope('b', 0));
    expect(parse('$ => $.b')).toEqual(new AccessScope('b', 0));
    expect(parse('(x) => x.name')).toEqual(new AccessScope('name', 0));
  });

  it('parses properties', () => {
    expect(parser.parseProperty('firstName')).toEqual({ name: 'firstName', displayName: null });
    expect(parser.parseProperty('3_letter_id')).toEqual({ name: '3_letter_id', displayName: null });
    expect(parser.parseProperty('. @$# ???')).toEqual({ name: '. @$# ???', displayName: null });
    expect(parser.parseProperty((x: any) => x.firstName)).toEqual({ name: 'firstName', displayName: null });
  });
});
