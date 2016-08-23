import {metadata} from 'aurelia-metadata';
import {Rule, RuleProperty} from './rule';
import {ValidationParser, PropertyAccessor} from './validation-parser';
import {isString} from './util';
import {metadataKey} from './metadata-key';
import {validationMessages} from './validation-messages';

export class FluentRuleCustomizer<TObject, TValue> {
  private rule: Rule<TObject, TValue>;

  constructor(
    property: RuleProperty,
    condition: (value: TValue, object?: TObject) => boolean|Promise<boolean>,
    config: Object = {},
    private fluentEnsure: FluentEnsure<TObject>,
    private fluentRules: FluentRules<TObject, TValue>,
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
    this.fluentEnsure.rules.push(this.rule);
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

  when(condition: (object: TObject) => boolean) {
    this.rule.when = condition;
    return this;
  }

  /** FluentEnsure APIs **/

  ensure<TValue2>(subject: string|{ (model: TObject): TValue2; }) {
    return this.fluentEnsure.ensure<TValue2>(subject);
  }

  ensureObject() {
    return this.fluentEnsure.ensureObject();
  }

  get rules() {
    return this.fluentEnsure.rules;
  }  

  on(target: any) {
    return this.fluentEnsure.on(target);
  }

  /** FluentRules APIs **/

  satisfies(condition: (value: TValue, object?: TObject) => boolean|Promise<boolean>, config?: Object) {
    return this.fluentRules.satisfies(condition, config);
  }

  /**
   * Applies a custom rule.
   * @param name The name of the custom rule.
   * @param args The custom rule's arguments.
   */
  satisfiesRule(name: string, ...args: any[]) {
    return this.fluentRules.satisfiesRule(name, ...args);
  }

  required() {
    return this.fluentRules.required();
  }

  matches(regex: RegExp) {
    return this.fluentRules.matches(regex);
  }

  email() {
    return this.fluentRules.email();
  }

  minLength(length: number) {
    return this.fluentRules.minLength(length);
  }

  maxLength(length: number) {
    return this.fluentRules.maxLength(length);
  }

  minItems(count: number) {
    return this.fluentRules.minItems(count);
  }

  maxItems(count: number) {
    return this.fluentRules.maxItems(count);
  }
}

export class FluentRules<TObject, TValue> {
  static customRules: { 
    [name: string]: {
      condition: (value: any, object?: any, ...fluentArgs: any[]) => boolean|Promise<boolean>;
      argsToConfig?: (...args: any[]) => any;
    }
  } = {};

  constructor(
    private fluentEnsure: FluentEnsure<TObject>,
    private parser: ValidationParser,
    private property: RuleProperty
  ) {}

  displayName(name: string) {
    this.property.displayName = name;
    return this;
  }

  satisfies(condition: (value: TValue, object?: TObject) => boolean|Promise<boolean>, config?: Object) {
    return new FluentRuleCustomizer<TObject, TValue>(this.property, condition, config, this.fluentEnsure, this, this.parser);
  }

  /**
   * Applies a custom rule.
   * @param name The name of the custom rule.
   * @param args The custom rule's arguments.
   */
  satisfiesRule(name: string, ...args: any[]) {
    const rule = FluentRules.customRules[name];
    if (!rule) {
      throw new Error(`Custom rule with name "${name}" does not exist.`);
    }
    const config = rule.argsToConfig ? rule.argsToConfig(...args) : undefined;
    return this.satisfies((value, obj) => rule.condition.call(this, value, obj, ...args), config)
      .withMessageKey(name);
  }

  required() {
    return this.satisfies(
      value => 
        value !== null
        && value !== undefined
        && !(isString(value) && !/\S/.test(<any>value))
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

export class FluentEnsure<TObject> {
  public rules: Rule<TObject, any>[] = [];

  constructor(private parser: ValidationParser) {}

  ensure<TValue>(property: string|PropertyAccessor<TObject, TValue>) {
    this.assertInitialized();
    return new FluentRules<TObject, TValue>(this, this.parser, this.parser.parseProperty(property));
  }

  ensureObject() {
    this.assertInitialized();
    return new FluentRules<TObject, TObject>(this, this.parser, { name: null, displayName: null })
  }

  on(target: any) {
    if (target instanceof Function) {
      target = target.prototype;
    }
    metadata.define(metadataKey, this.rules, target);
    return this;
  }

  private assertInitialized() {
    if (this.parser) {
      return;
    }
    throw new Error(`Did you forget to add ".plugin('aurelia-validation)" to your main.js?`);
  }
}

export class ValidationRules {
  private static parser: ValidationParser;

  static initialize(parser: ValidationParser) {
    ValidationRules.parser = parser;
  }

  static ensure<TObject, TValue>(property: string|PropertyAccessor<TObject, TValue>) {
    return new FluentEnsure<TObject>(ValidationRules.parser).ensure(property);
  }

  static ensureObject<TObject>() {
    return new FluentEnsure<TObject>(ValidationRules.parser).ensureObject();
  }

  /**
   * Defines a custom rule.
   * @param name The name of the custom rule. Also serves as the message key.
   * @param condition The rule function.
   * @param message The message expression
   * @param argsToConfig A function that maps the rule's arguments to a "config" object that can be used when evaluating the message expression.
   */
  static customRule(
    name: string,
    condition: (value: any, object?: any, ...args: any[]) => boolean|Promise<boolean>,
    message: string,
    argsToConfig?: (...args: any[]) => any
  ) {
    validationMessages[name] = message;
    FluentRules.customRules[name] = { condition, argsToConfig };
  }  
}
