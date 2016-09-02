import {Expression, AccessScope} from 'aurelia-binding';
import {Container} from 'aurelia-dependency-injection';
import {BindingLanguage} from 'aurelia-templating'
import {TemplatingBindingLanguage} from 'aurelia-templating-binding';
import {ValidationParser} from '../src/aurelia-validation';

declare var describe: { (name: string, fn: () => void): void };
declare var beforeAll: { (fn: () => void): void };
declare var it: { (name: string, fn: (done?: () => void) => void): void };
declare var expect: (x: any) => any;

describe('Validator', () => {
  let parser: ValidationParser;

  beforeAll(() => {
    const container = new Container();
    container.registerInstance(BindingLanguage, container.get(TemplatingBindingLanguage));
    parser = container.get(ValidationParser);
  });

  it('parses function bodies', () => {
    const parse: (fn: string) => Expression = (<any>parser).getAccessorExpression.bind(parser);
    expect(parse('function(a){return a.b}')).toEqual(new AccessScope('b', 0));
    expect(parse('function(a){return a.b;}')).toEqual(new AccessScope('b', 0));
    expect(parse('function (a){return a.b;}')).toEqual(new AccessScope('b', 0));
    expect(parse('function(a) {return a.b;}')).toEqual(new AccessScope('b', 0));
    expect(parse('function (a) { return a.b; }')).toEqual(new AccessScope('b', 0));
    expect(parse('function (a1) { return a1.bcde; }')).toEqual(new AccessScope('bcde', 0));
    expect(parse('function ($a1) { return $a1.bcde; }')).toEqual(new AccessScope('bcde', 0));
    expect(parse('function (_) { return _.bc_de; }')).toEqual(new AccessScope('bc_de', 0));
    expect(parse('a=>a.b')).toEqual(new AccessScope('b', 0));
    expect(parse('a =>a.b')).toEqual(new AccessScope('b', 0));
    expect(parse('a=> a.b')).toEqual(new AccessScope('b', 0));
    expect(parse('a => a.b')).toEqual(new AccessScope('b', 0));
    expect(parse('a => a.bcde')).toEqual(new AccessScope('bcde', 0));
    expect(parse('_ => _.b')).toEqual(new AccessScope('b', 0));
    expect(parse('$ => $.b')).toEqual(new AccessScope('b', 0));
  });
});
