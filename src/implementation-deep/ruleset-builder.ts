import {metadata} from 'aurelia-metadata';
import {Rule, Subject, Condition, WhenFunction} from './rule';
import {ValidationParser} from './validation-parser';
import {isString} from './util';
import {rebaseExpression} from './expression-rebaser';
import {metadataKey} from './metadata-key';

export const $all = 0;

export class Builder3<TModel, TValue> {
  private rule: Rule;

  constructor(
    subject: Subject,
    condition: Condition<TModel, TValue>,
    config: Object = {},
    private builder1: Builder1<TModel>,
    private builder2: Builder2<TModel, TValue>,
    private parser: ValidationParser
  ) {
    this.rule = {
      subject,
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

  when(condition: WhenFunction<TModel>) {
    this.rule.when = condition;
    return this;
  }

  /** Builder1 APIs **/

  ensure<TValue2>(subject: string|{ (model: TModel): TValue2; }) {
    return this.builder1.ensure<TValue2>(subject);
  }

  ensureModel() {
    return this.builder1.ensureModel();
  }

  compose<TModel2>(accessor: { (model: TModel): TModel2; }, rules: Rule[]) {
    return this.builder1.compose(accessor, rules);
  }

  get rules() {
    return this.builder1.rules;
  }  

  on(target: any) {
    return this.builder1.on(target);
  }

  /** Builder2 APIs **/

  satisfies(condition: Condition<TModel, TValue>, config?: Object) {
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
    private subject: Subject
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

export class Builder1<TModel> {
  public rules: Rule[] = [];

  constructor(private parser: ValidationParser) {}

  ensure<TValue>(subject: string|{ (model: TModel): TValue; }) {
    return new Builder2<TModel, TValue>(this, this.parser, this.parser.parseSubject(subject));
  }

  ensureModel() {
    return this.ensure<TModel>('$this');
  }

  compose<TModel2>(accessor: { (model: TModel): TModel2; }, rules: Rule[]) {
    const base = this.parser.parseSubject(accessor).value;
    for (let original of rules) {
      let rule: Rule = {
        subject: {
          model: base,
          object: rebaseExpression(original.subject.object, base),
          value: rebaseExpression(original.subject.value, base),
          propertyName: original.subject.propertyName,
          displayName: original.subject.displayName
        },
        condition: original.condition,
        config: Object,
        when: original.when,
        messageKey: original.messageKey,
        message: original.message === null ? null : rebaseExpression(original.message, base)
      };
      this.rules.push(rule);
    }
    return this;
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

  static ensure<TModel, TValue>(subject: string|{ (model: TModel): TValue }) {
    return new Builder1<TModel>(ValidationRules.parser).ensure(subject);
  }

  static ensureModel<TModel>() {
    return new Builder1<TModel>(ValidationRules.parser).ensureModel();
  }
}
