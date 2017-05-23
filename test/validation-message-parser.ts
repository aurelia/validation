import { Container } from 'aurelia-dependency-injection';
import { BindingLanguage } from 'aurelia-templating';
import { TemplatingBindingLanguage } from 'aurelia-templating-binding';
import { ValidationMessageParser } from '../src/aurelia-validation';
import { LiteralString, Binary } from 'aurelia-binding';

describe('ValidationMessageParser', () => {
  let parser: ValidationMessageParser;

  beforeAll(() => {
    const container = new Container();
    container.registerInstance(BindingLanguage, container.get(TemplatingBindingLanguage));
    parser = container.get(ValidationMessageParser);
  });

  it('parses', () => {
    expect(parser.parse('test') instanceof LiteralString).toBe(true);
    // tslint:disable-next-line:no-invalid-template-strings
    expect(parser.parse('${$value} is invalid') instanceof Binary).toBe(true);
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:no-invalid-template-strings
    expect(parser.parse('${$value} should equal ${$object.foo.bar().baz ? object.something[0] : \'test\'}') instanceof Binary).toBe(true);
  });
});
