import {metadata} from 'aurelia-metadata';
import {Rule, RuleProperty, Condition, ValidateWhen} from './rule';
import {ValidationParser, PropertyAccessor} from './validation-parser';
import {isString} from './util';
import {metadataKey} from './metadata-key';

export const $all = 0;

export class Builder3<TObject, TValue> {
  private rule: Rule<TObject, TValue>;

  constructor(
    property: RuleProperty,
    condition: Condition<TObject, TValue>,
    config: Object = {},
    private builder1: Builder1<TObject>,
    private builder2: Builder2<TObject, TValue>,
    private parser: ValidationParser
  ) {
    this.rule = {
      property,
      condition,
      config,
      when: null,
      messageKey: 'default',
      message: null
    };
    this.builder1.rules.push(this.rule);
  }

  withMessageKey(key: string) {
    this.rule.messageKey = key;
    this.rule.message = null;
    return this;
  }

  withMessage(message: string) {
    this.rule.messageKey = 'custom';
    this.rule.message = this.parser.parseMessage(message);
    return this;
  }

  when(condition: ValidateWhen<TObject>) {
    this.rule.when = condition;
    return this;
  }

  /** Builder1 APIs **/

  ensure<TValue2>(subject: string|{ (model: TObject): TValue2; }) {
    return this.builder1.ensure<TValue2>(subject);
  }

  ensureModel() {
    return this.builder1.ensureObject();
  }

  get rules() {
    return this.builder1.rules;
  }  

  on(target: any) {
    return this.builder1.on(target);
  }

  /** Builder2 APIs **/

  satisfies(condition: Condition<TObject, TValue>, config?: Object) {
    return this.builder2.satisfies(condition, config);
  }

  required() {
    return this.builder2.required();
  }

  matches(regex: RegExp) {
    return this.builder2.matches(regex);
  }

  email() {
    return this.builder2.email();
  }

  minLength(length: number) {
    return this.builder2.minLength(length);
  }

  maxLength(length: number) {
    return this.builder2.maxLength(length);
  }

  minItems(count: number) {
    return this.builder2.minItems(count);
  }

  maxItems(count: number) {
    return this.builder2.maxItems(count);
  }
}

export class Builder2<TModel, TValue> {
  constructor(
    private builder1: Builder1<TModel>,
    private parser: ValidationParser,
    private subject: RuleProperty
  ) {}

  displayName(name: string) {
    this.subject.displayName = name;
    return this;
  }

  satisfies(condition: Condition<TModel, TValue>, config?: Object) {
    return new Builder3<TModel, TValue>(this.subject, condition, config, this.builder1, this, this.parser);
  }

  required() {
    return this.satisfies(
      value => !(
        value === null
        || value === undefined
        || isString(value) && !/S/.test(<any>value))
    ).withMessageKey('required');
  }

  matches(regex: RegExp) {
    return this.satisfies(value => value === null || value === undefined || regex.test(<any>value))
      .withMessageKey('matches');
  }

  email() {
    return this.matches(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/)
      .withMessageKey('email');
  }

  minLength(length: number) {
    return this.satisfies((value: any) => value === null || value === undefined || value.length >= length, { length })
      .withMessageKey('minLength');
  }

  maxLength(length: number) {
    return this.satisfies((value: any) => value === null || value === undefined || value.length <= length, { length })
      .withMessageKey('maxLength');
  }

  minItems(count: number) {
    return this.satisfies((value: any) => value === null || value === undefined || value.length >= count, { count })
      .withMessageKey('minItems');
  }

  maxItems(count: number) {
    return this.satisfies((value: any) => value === null || value === undefined || value.length <= count, { count })
      .withMessageKey('maxItems');
  }
}

export class Builder1<TObject> {
  public rules: Rule<TObject, any>[] = [];

  constructor(private parser: ValidationParser) {}

  ensure<TValue>(property: string|PropertyAccessor<TObject, TValue>) {
    return new Builder2<TObject, TValue>(this, this.parser, this.parser.parseProperty(property));
  }

  ensureObject() {
    return this.ensure<TObject>('$this');
  }

  on(target: any) {
    if (target instanceof Function) {
      target = target.prototype;
    }
    metadata.define(metadataKey, this.rules, target);
    return this;
  }
}

export class ValidationRules {
  private static parser: ValidationParser;

  static initialize(parser: ValidationParser) {
    ValidationRules.parser = parser;
  }

  static ensure<TObject, TValue>(property: string|PropertyAccessor<TObject, TValue>) {
    return new Builder1<TObject>(ValidationRules.parser).ensure(property);
  }

  static ensureObject<TModel>() {
    return new Builder1<TModel>(ValidationRules.parser).ensureObject();
  }
}
