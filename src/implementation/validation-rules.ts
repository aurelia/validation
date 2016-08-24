import {metadata} from 'aurelia-metadata';
import {Rule, RuleProperty} from './rule';
import {ValidationParser, PropertyAccessor} from './validation-parser';
import {isString} from './util';
import {metadataKey} from './metadata-key';
import {validationMessages} from './validation-messages';

/**
 * Part of the fluent rule API. Enables customizing property rules.
 */
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

  /**
   * Specifies the key to use when looking up the rule's validation message.
   */
  withMessageKey(key: string) {
    this.rule.messageKey = key;
    this.rule.message = null;
    return this;
  }

  /**
   * Specifies rule's validation message.
   */
  withMessage(message: string) {
    this.rule.messageKey = 'custom';
    this.rule.message = this.parser.parseMessage(message);
    return this;
  }

  /**
   * Specifies a condition that must be met before attempting to validate the rule.
   * @param condition A function that accepts the object as a parameter and returns true
   * or false whether the rule should be evaluated.
   */
  when(condition: (object: TObject) => boolean) {
    this.rule.when = condition;
    return this;
  }

  /**
   * Tags the rule instance, enabling the rule to be found easily 
   * using ValidationRules.taggedRules(rules, tag)
   */
  tag(tag: string) {
    this.rule.tag = tag;
    return this;
  }

  ///// FluentEnsure APIs /////

  /**
   * Target a property with validation rules.
   * @param property The property to target. Can be the property name or a property accessor function.
   */
  ensure<TValue2>(subject: string|{ (model: TObject): TValue2; }) {
    return this.fluentEnsure.ensure<TValue2>(subject);
  }

  /**
   * Targets an object with validation rules.
   */
  ensureObject() {
    return this.fluentEnsure.ensureObject();
  }

  /**
   * Rules that have been defined using the fluent API.
   */
  get rules() {
    return this.fluentEnsure.rules;
  }  

  /**
   * Applies the rules to a class or object, making them discoverable by the StandardValidator.
   * @param target A class or object.
   */
  on(target: any) {
    return this.fluentEnsure.on(target);
  }

  ///////// FluentRules APIs /////////

  /**
   * Applies an ad-hoc rule function to the ensured property or object.
   * @param condition The function to validate the rule.
   * Will be called with two arguments, the property value and the object.
   * Should return a boolean or a Promise that resolves to a boolean. 
   */
  satisfies(condition: (value: TValue, object?: TObject) => boolean|Promise<boolean>, config?: Object) {
    return this.fluentRules.satisfies(condition, config);
  }

  /**
   * Applies a rule by name.
   * @param name The name of the custom or standard rule.
   * @param args The rule's arguments.
   */
  satisfiesRule(name: string, ...args: any[]) {
    return this.fluentRules.satisfiesRule(name, ...args);
  }

  /**
   * Applies the "required" rule to the property. 
   * The value cannot be null, undefined or whitespace.
   */
  required() {
    return this.fluentRules.required();
  }

  /**
   * Applies the "matches" rule to the property.
   * Value must match the specified regular expression.
   * null, undefined and empty-string values are considered valid.
   */
  matches(regex: RegExp) {
    return this.fluentRules.matches(regex);
  }

  /**
   * Applies the "email" rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  email() {
    return this.fluentRules.email();
  }

  /**
   * Applies the "minLength" STRING validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  minLength(length: number) {
    return this.fluentRules.minLength(length);
  }

  /**
   * Applies the "maxLength" STRING validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  maxLength(length: number) {
    return this.fluentRules.maxLength(length);
  }

  /**
   * Applies the "minItems" ARRAY validation rule to the property.
   * null and undefined values are considered valid.
   */
  minItems(count: number) {
    return this.fluentRules.minItems(count);
  }

  /**
   * Applies the "maxItems" ARRAY validation rule to the property.
   * null and undefined values are considered valid.
   */
  maxItems(count: number) {
    return this.fluentRules.maxItems(count);
  }
}

/**
 * Part of the fluent rule API. Enables applying rules to properties and objects.
 */
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

  /**
   * Sets the display name of the ensured property.
   */
  displayName(name: string) {
    this.property.displayName = name;
    return this;
  }

  /**
   * Applies an ad-hoc rule function to the ensured property or object.
   * @param condition The function to validate the rule.
   * Will be called with two arguments, the property value and the object.
   * Should return a boolean or a Promise that resolves to a boolean. 
   */
  satisfies(condition: (value: TValue, object?: TObject) => boolean|Promise<boolean>, config?: Object) {
    return new FluentRuleCustomizer<TObject, TValue>(this.property, condition, config, this.fluentEnsure, this, this.parser);
  }

  /**
   * Applies a rule by name.
   * @param name The name of the custom or standard rule.
   * @param args The rule's arguments.
   */
  satisfiesRule(name: string, ...args: any[]) {
    let rule = FluentRules.customRules[name];
    if (!rule) {
      // standard rule?
      rule = (<any>this)[name];
      if (rule instanceof Function) {
        return rule.call(this, ...args);
      }
      throw new Error(`Rule with name "${name}" does not exist.`);
    }
    const config = rule.argsToConfig ? rule.argsToConfig(...args) : undefined;
    return this.satisfies((value, obj) => rule.condition.call(this, value, obj, ...args), config)
      .withMessageKey(name);
  }

  /**
   * Applies the "required" rule to the property. 
   * The value cannot be null, undefined or whitespace.
   */
  required() {
    return this.satisfies(
      value => 
        value !== null
        && value !== undefined
        && !(isString(value) && !/\S/.test(<any>value))
    ).withMessageKey('required');
  }

  /**
   * Applies the "matches" rule to the property.
   * Value must match the specified regular expression.
   * null, undefined and empty-string values are considered valid.
   */
  matches(regex: RegExp) {
    return this.satisfies(value => value === null || value === undefined || (<any>value).length === 0 || regex.test(<any>value))
      .withMessageKey('matches');
  }

  /**
   * Applies the "email" rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  email() {
    return this.matches(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/)
      .withMessageKey('email');
  }

  /**
   * Applies the "minLength" STRING validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  minLength(length: number) {
    return this.satisfies((value: any) => value === null || value === undefined || value.length === 0 || value.length >= length, { length })
      .withMessageKey('minLength');
  }

  /**
   * Applies the "maxLength" STRING validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  maxLength(length: number) {
    return this.satisfies((value: any) => value === null || value === undefined || value.length === 0 || value.length <= length, { length })
      .withMessageKey('maxLength');
  }

  /**
   * Applies the "minItems" ARRAY validation rule to the property.
   * null and undefined values are considered valid.
   */
  minItems(count: number) {
    return this.satisfies((value: any) => value === null || value === undefined || value.length >= count, { count })
      .withMessageKey('minItems');
  }

  /**
   * Applies the "maxItems" ARRAY validation rule to the property.
   * null and undefined values are considered valid.
   */
  maxItems(count: number) {
    return this.satisfies((value: any) => value === null || value === undefined || value.length <= count, { count })
      .withMessageKey('maxItems');
  }
}

/**
 * Part of the fluent rule API. Enables targeting properties and objects with rules.
 */
export class FluentEnsure<TObject> {
  /**
   * Rules that have been defined using the fluent API.
   */
  public rules: Rule<TObject, any>[] = [];

  constructor(private parser: ValidationParser) {}

  /**
   * Target a property with validation rules.
   * @param property The property to target. Can be the property name or a property accessor function.
   */
  ensure<TValue>(property: string|PropertyAccessor<TObject, TValue>) {
    this.assertInitialized();
    return new FluentRules<TObject, TValue>(this, this.parser, this.parser.parseProperty(property));
  }

  /**
   * Targets an object with validation rules.
   */
  ensureObject() {
    this.assertInitialized();
    return new FluentRules<TObject, TObject>(this, this.parser, { name: null, displayName: null })
  }

  /**
   * Applies the rules to a class or object, making them discoverable by the StandardValidator.
   * @param target A class or object.
   */
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

/**
 * Fluent rule definition API.
 */
export class ValidationRules {
  private static parser: ValidationParser;

  static initialize(parser: ValidationParser) {
    ValidationRules.parser = parser;
  }

  /**
   * Target a property with validation rules.
   * @param property The property to target. Can be the property name or a property accessor function.
   */
  static ensure<TObject, TValue>(property: string|PropertyAccessor<TObject, TValue>) {
    return new FluentEnsure<TObject>(ValidationRules.parser).ensure(property);
  }

  /**
   * Targets an object with validation rules.
   */
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
  
  /**
   * Returns rules with the matching tag.
   * @param rules The rules to search.
   * @param tag The tag to search for.
   */
  static taggedRules(rules: Rule<any, any>[], tag: string): Rule<any, any>[] {
    return rules.filter(r => r.tag === tag);
  } 
}
