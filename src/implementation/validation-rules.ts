import { Rule, RuleProperty } from './rule';
import { ValidationParser, PropertyAccessor } from './validation-parser';
import { isString } from './util';
import { Rules } from './rules';
import { validationMessages } from './validation-messages';

export class FluentRulesGenerator<TObject> {

  private fluentCustomizer: FluentRuleCustomizer<TObject, any> | null = null;
  private fluentRules: FluentRules<TObject, any> | null = null;

  constructor(private fluentEnsure: FluentEnsure<TObject>) {
    if (!fluentEnsure) {
      throw new Error(`FluentRuleGenerator requires an instance of FluentEnsure`);
    }
  }

  /**
   * Target a property with validation rules.
   * @param property The property to target. Can be the property name or a property accessor function.
   */
  public ensure<TValue>(property: string | PropertyAccessor<TObject, TValue>): FluentRulesGenerator<TObject> {
    this.fluentRules = this.fluentEnsure!.ensure(property);
    this.fluentCustomizer = null;
    return this;
  }
  /**
   * Targets an object with validation rules.
   */
  public ensureObject(): FluentRulesGenerator<TObject> {
    this.fluentRules = this.fluentEnsure!.ensureObject();
    this.fluentCustomizer = null;
    return this;
  }
  /**
   * Sets the display name of the ensured property.
   */
  public displayName(name: string): FluentRulesGenerator<TObject> {
    this.fluentRules!.displayName(name);
    return this;
  }
  /**
   * Applies an ad-hoc rule function to the ensured property or object.
   * @param condition The function to validate the rule.
   * Will be called with two arguments, the property value and the object.
   * Should return a boolean or a Promise that resolves to a boolean. 
   */
  // tslint:disable-next-line:max-line-length
  public satisfies<TValue>(condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config?: Object): FluentRulesGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.satisfies(condition, config);
    return this;
  }
  /**
   * Applies a rule by name.
   * @param name The name of the custom or standard rule.
   * @param args The rule's arguments.
   */
  public satisfiesRule(name: string, ...args: any[]): FluentRulesGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.satisfiesRule(name, ...args);
    return this;
  }
  /**
   * Applies the "required" rule to the property. 
   * The value cannot be null, undefined or whitespace.
   */
  public required(): FluentRulesGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.required();
    return this;
  }
  /**
   * Applies the "matches" rule to the property.
   * Value must match the specified regular expression.
   * null, undefined and empty-string values are considered valid.
   */
  public matches(regex: RegExp): FluentRulesGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.matches(regex);
    return this;
  }
  /**
   * Applies the "email" rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public email(): FluentRulesGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.email();
    return this;
  }
  /**
   * Applies the "minLength" STRING validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public minLength(length: number): FluentRulesGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.minLength(length);
    return this;
  }
  /**
   * Applies the "maxLength" STRING validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public maxLength(length: number): FluentRulesGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.maxLength(length);
    return this;
  }
  /**
   * Applies the "minItems" ARRAY validation rule to the property.
   * null and undefined values are considered valid.
   */
  public minItems(count: number): FluentRulesGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.minItems(count);
    return this;
  }
  /**
   * Applies the "maxItems" ARRAY validation rule to the property.
   * null and undefined values are considered valid.
   */
  public maxItems(count: number): FluentRulesGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.maxItems(count);
    return this;
  }
  /**
   * Applies the "equals" validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public equals<TValue>(expectedValue: TValue): FluentRulesGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.equals(expectedValue);
    return this;
  }
  /**
   * Validate subsequent rules after previously declared rules have
   * been validated successfully. Use to postpone validation of costly
   * rules until less expensive rules pass validation. 
   */
  public then(): FluentRulesGenerator<TObject> {
    this.assertFluentCustomizer();
    this.fluentCustomizer!.then();
    return this;
  }
  /**
   * Specifies the key to use when looking up the rule's validation message.
   */
  public withMessageKey(key: string): FluentRulesGenerator<TObject> {
    this.assertFluentCustomizer();
    this.fluentCustomizer!.withMessageKey(key);
    return this;
  }
  /**
   * Specifies rule's validation message.
   */
  public withMessage(message: string): FluentRulesGenerator<TObject> {
    this.assertFluentCustomizer();
    this.fluentCustomizer!.withMessage(message);
    return this;
  }
  /**
   * Specifies a condition that must be met before attempting to validate the rule.
   * @param condition A function that accepts the object as a parameter and returns true
   * or false whether the rule should be evaluated.
   */
  public when(condition: (object: TObject) => boolean): FluentRulesGenerator<TObject> {
    this.assertFluentCustomizer();
    this.fluentCustomizer!.when(condition);
    return this;
  }
  /**
   * Tags the rule instance, enabling the rule to be found easily 
   * using ValidationRules.taggedRules(rules, tag)
   */
  public tag(tag: string): FluentRulesGenerator<TObject> {
    this.assertFluentCustomizer();
    this.fluentCustomizer!.tag(tag);
    return this;
  }
  /**
   * Applies the rules to a class or object, making them discoverable by the StandardValidator.
   * @param target A class or object.
   */
  public on(target: any): FluentRulesGenerator<TObject> {
    this.fluentEnsure!.on(target);
    return this;
  }
  /**
   * Rules that have been defined using the fluent API.
   */
  public get rules(): Array<Array<Rule<TObject, any>>> {
    return this.fluentEnsure!.rules;
  }
  /**
   * Current rule sequence number. Used to postpone evaluation of rules until rules
   * with lower sequence number have successfully validated. The "then" fluent API method
   * manages this property, there's usually no need to set it directly.
   */
  public get sequence(): number {
    return this.fluentRules!.sequence;
  }

  public get customRules(): {
    [name: string]: {
      condition: (value: any, object?: any, ...fluentArgs: any[]) => boolean | Promise<boolean>;
      argsToConfig?: (...args: any[]) => any;
    }
  } {
    return FluentRules.customRules;
  }

  private assertFluentCustomizer(): void | never {
    if (!this.fluentCustomizer) {
      throw new Error(`Invalid call sequence.  Are you trying to modify a rule that has not be defined?`);
    }
  }
}

/**
 * @Deprecated.  FluentRulesGenerator has taken its place.
 * Part of the fluent rule API. Enables customizing property rules.
 */
export class FluentRuleCustomizer<TObject, TValue> {

  private rule: Rule<TObject, TValue>;

  constructor(
    property: RuleProperty,
    condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>,
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
      message: null,
      sequence: fluentRules.sequence
    };
    this.fluentEnsure._addRule(this.rule);
  }

  /**
   * Validate subsequent rules after previously declared rules have
   * been validated successfully. Use to postpone validation of costly
   * rules until less expensive rules pass validation. 
   */
  public then(): FluentRuleCustomizer<TObject, TValue> {
    this.fluentRules.sequence++;
    return this;
  }

  /**
   * Specifies the key to use when looking up the rule's validation message.
   */
  public withMessageKey(key: string): FluentRuleCustomizer<TObject, TValue> {
    this.rule.messageKey = key;
    this.rule.message = null;
    return this;
  }

  /**
   * Specifies rule's validation message.
   */
  public withMessage(message: string): FluentRuleCustomizer<TObject, TValue> {
    this.rule.messageKey = 'custom';
    this.rule.message = this.parser.parseMessage(message);
    return this;
  }

  /**
   * Specifies a condition that must be met before attempting to validate the rule.
   * @param condition A function that accepts the object as a parameter and returns true
   * or false whether the rule should be evaluated.
   */
  public when(condition: (object: TObject) => boolean): FluentRuleCustomizer<TObject, TValue> {
    this.rule.when = condition;
    return this;
  }

  /**
   * Tags the rule instance, enabling the rule to be found easily 
   * using ValidationRules.taggedRules(rules, tag)
   */
  public tag(tag: string): FluentRuleCustomizer<TObject, TValue> {
    this.rule.tag = tag;
    return this;
  }

  /*****************************************************************
    The rest is deprecated,  only here to 
    implement the FluentRuleCustomizer interface for backward compatibility.
   *****************************************************************/

  ///// FluentEnsure APIs /////

  /**
   * Target a property with validation rules.
   * @param property The property to target. Can be the property name or a property accessor function.
   */
  public ensure<TValue2>(subject: string | ((model: TObject) => TValue2)): FluentRules<TObject, TValue2> {
    return this.fluentEnsure.ensure<TValue2>(subject);
  }

  /**
   * Targets an object with validation rules.
   */
  public ensureObject(): FluentRules<TObject, TObject> {
    return this.fluentEnsure.ensureObject();
  }

  /**
   * Rules that have been defined using the fluent API.
   */
  public get rules(): Array<Array<Rule<TObject, any>>> {
    return this.fluentEnsure.rules;
  }

  /**
   * Applies the rules to a class or object, making them discoverable by the StandardValidator.
   * @param target A class or object.
   */
  public on(target: any): FluentEnsure<TObject> {
    return this.fluentEnsure.on(target);
  }

  ///////// FluentRules APIs /////////

  /**
   * Applies an ad-hoc rule function to the ensured property or object.
   * @param condition The function to validate the rule.
   * Will be called with two arguments, the property value and the object.
   * Should return a boolean or a Promise that resolves to a boolean. 
   */
  // tslint:disable-next-line:max-line-length
  public satisfies(condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config?: Object): FluentRuleCustomizer<TObject, TValue> {
    return this.fluentRules.satisfies(condition, config);
  }

  /**
   * Applies a rule by name.
   * @param name The name of the custom or standard rule.
   * @param args The rule's arguments.
   */
  public satisfiesRule(name: string, ...args: any[]): FluentRuleCustomizer<TObject, TValue> {
    return this.fluentRules.satisfiesRule(name, ...args);
  }

  /**
   * Applies the "required" rule to the property. 
   * The value cannot be null, undefined or whitespace.
   */
  public required(): FluentRuleCustomizer<TObject, TValue> {
    return this.fluentRules.required();
  }

  /**
   * Applies the "matches" rule to the property.
   * Value must match the specified regular expression.
   * null, undefined and empty-string values are considered valid.
   */
  public matches(regex: RegExp): FluentRuleCustomizer<TObject, TValue> {
    return this.fluentRules.matches(regex);
  }

  /**
   * Applies the "email" rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public email(): FluentRuleCustomizer<TObject, TValue> {
    return this.fluentRules.email();
  }

  /**
   * Applies the "minLength" STRING validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public minLength(length: number): FluentRuleCustomizer<TObject, TValue> {
    return this.fluentRules.minLength(length);
  }

  /**
   * Applies the "maxLength" STRING validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public maxLength(length: number): FluentRuleCustomizer<TObject, TValue> {
    return this.fluentRules.maxLength(length);
  }

  /**
   * Applies the "minItems" ARRAY validation rule to the property.
   * null and undefined values are considered valid.
   */
  public minItems(count: number): FluentRuleCustomizer<TObject, TValue> {
    return this.fluentRules.minItems(count);
  }

  /**
   * Applies the "maxItems" ARRAY validation rule to the property.
   * null and undefined values are considered valid.
   */
  public maxItems(count: number): FluentRuleCustomizer<TObject, TValue> {
    return this.fluentRules.maxItems(count);
  }

  /**
   * Applies the "equals" validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public equals(expectedValue: TValue): FluentRuleCustomizer<TObject, TValue> {
    return this.fluentRules.equals(expectedValue);
  }
}

/**
 * @Deprecated.  FluentRulesGenerator has taken its place.
 * Part of the fluent rule API. Enables applying rules to properties and objects.
 */
export class FluentRules<TObject, TValue> {

  public static customRules: {
    [name: string]: {
      condition: (value: any, object?: any, ...fluentArgs: any[]) => boolean | Promise<boolean>;
      argsToConfig?: (...args: any[]) => any;
    }
  } = {};

  /**
   * Current rule sequence number. Used to postpone evaluation of rules until rules
   * with lower sequence number have successfully validated. The "then" fluent API method
   * manages this property, there's usually no need to set it directly.
   */
  public sequence = 0;

  constructor(
    private fluentEnsure: FluentEnsure<TObject>,
    private parser: ValidationParser,
    private property: RuleProperty
  ) { }

  /**
   * Sets the display name of the ensured property.
   */
  public displayName(name: string) {
    this.property.displayName = name;
    return this;
  }

  /**
   * Applies an ad-hoc rule function to the ensured property or object.
   * @param condition The function to validate the rule.
   * Will be called with two arguments, the property value and the object.
   * Should return a boolean or a Promise that resolves to a boolean. 
   */
  // tslint:disable-next-line:max-line-length
  public satisfies(condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config?: Object): FluentRuleCustomizer<TObject, TValue> {
    return new FluentRuleCustomizer<TObject, TValue>(
      this.property, condition, config, this.fluentEnsure, this, this.parser);
  }

  /**
   * Applies a rule by name.
   * @param name The name of the custom or standard rule.
   * @param args The rule's arguments.
   */
  public satisfiesRule(name: string, ...args: any[]) {
    let rule = FluentRules.customRules[name];
    if (!rule) {
      // standard rule?
      rule = (this as any)[name];
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
  public required() {
    return this.satisfies(
      value =>
        value !== null
        && value !== undefined
        && !(isString(value) && !/\S/.test(value as any))
    ).withMessageKey('required');
  }

  /**
   * Applies the "matches" rule to the property.
   * Value must match the specified regular expression.
   * null, undefined and empty-string values are considered valid.
   */
  public matches(regex: RegExp) {
    return this.satisfies(
      value => value === null || value === undefined || (value as any).length === 0 || regex.test(value as any))
      .withMessageKey('matches');
  }

  /**
   * Applies the "email" rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public email() {
    // regex from https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
    /* tslint:disable:max-line-length */
    return this.matches(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
      /* tslint:enable:max-line-length */
      .withMessageKey('email');
  }

  /**
   * Applies the "minLength" STRING validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public minLength(length: number) {
    return this.satisfies(
      (value: any) => value === null || value === undefined || value.length === 0 || value.length >= length,
      { length })
      .withMessageKey('minLength');
  }

  /**
   * Applies the "maxLength" STRING validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public maxLength(length: number) {
    return this.satisfies(
      (value: any) => value === null || value === undefined || value.length === 0 || value.length <= length,
      { length })
      .withMessageKey('maxLength');
  }

  /**
   * Applies the "minItems" ARRAY validation rule to the property.
   * null and undefined values are considered valid.
   */
  public minItems(count: number) {
    return this.satisfies((value: any) => value === null || value === undefined || value.length >= count, { count })
      .withMessageKey('minItems');
  }

  /**
   * Applies the "maxItems" ARRAY validation rule to the property.
   * null and undefined values are considered valid.
   */
  public maxItems(count: number) {
    return this.satisfies((value: any) => value === null || value === undefined || value.length <= count, { count })
      .withMessageKey('maxItems');
  }

  /**
   * Applies the "equals" validation rule to the property.
   * null and undefined values are considered valid.
   */
  public equals(expectedValue: TValue) {
    return this.satisfies(
      value => value === null || value === undefined || value as any === '' || value === expectedValue,
      { expectedValue })
      .withMessageKey('equals');
  }
}

/**
 * @Deprecated.  FluentRulesGenerator has taken its place.
 * Part of the fluent rule API. Enables targeting properties and objects with rules.
 */
export class FluentEnsure<TObject> {
  /**
   * Rules that have been defined using the fluent API.
   */
  public rules: Array<Array<Rule<TObject, any>>> = [];
  private properties: Map<string, RuleProperty> = new Map<string, RuleProperty>();

  constructor(private parser: ValidationParser) { }

  /**
   * Target a property with validation rules.
   * @param property The property to target. Can be the property name or a property accessor 
   * function.
   */
  public ensure<TValue>(property: string | PropertyAccessor<TObject, TValue>): FluentRules<TObject, TValue> {
    this.assertInitialized();

    const ruleProperty = this.parser.parseProperty(property);

    // if this property has been previously-ensured then we want to use that RuleProperty object
    const preExistingProperty: RuleProperty | undefined = this.properties.get(ruleProperty.name as string);

    if (!preExistingProperty) {
      this.properties.set(ruleProperty.name as string, ruleProperty);
    }

    return new FluentRules<TObject, TValue>(this, this.parser,
      preExistingProperty ? preExistingProperty : ruleProperty);
  }

  /**
   * Targets an object with validation rules.
   */
  public ensureObject(): FluentRules<TObject, TObject> {
    this.assertInitialized();

    const objectPropertyKey = '__objectProp__';
    const ruleProperty: RuleProperty = { name: null, displayName: null };

    // if this property has been previously-ensured then we want to use that RuleProperty object
    const preExistingProperty: RuleProperty | undefined = this.properties.get(objectPropertyKey);

    if (!preExistingProperty) {
      this.properties.set(objectPropertyKey, ruleProperty);
    }

    return new FluentRules<TObject, TObject>(this, this.parser,
      preExistingProperty ? preExistingProperty : ruleProperty);
  }

  /**
   * Applies the rules to a class or object, making them discoverable by the StandardValidator.
   * @param target A class or object.
   */
  public on(target: any) {
    Rules.set(target, this.rules);
    return this;
  }

  /**
   * Adds a rule definition to the sequenced ruleset.
   */
  public _addRule(rule: Rule<TObject, any>) {
    while (this.rules.length < rule.sequence + 1) {
      this.rules.push([]);
    }

    this.rules[rule.sequence].push(rule);
  }

  private assertInitialized() {
    if (this.parser) {
      return;
    }
    throw new Error(`Did you forget to add ".plugin('aurelia-validation')" to your main.js?`);
  }
}

/**
 * Fluent rule definition API.
 */
export class ValidationRules {
  private static parser: ValidationParser;

  public static initialize(parser: ValidationParser) {
    ValidationRules.parser = parser;
  }

  /**
   * Target a property with validation rules.
   * @param property The property to target. Can be the property name or a property accessor function.
   */
  // tslint:disable-next-line:max-line-length
  public static ensure<TObject, TValue>(property: string | PropertyAccessor<TObject, TValue>): FluentRulesGenerator<TObject> {
    return new FluentRulesGenerator<TObject>(new FluentEnsure<TObject>(ValidationRules.parser)).ensure(property);
  }

  /**
   * Targets an object with validation rules.
   */
  public static ensureObject<TObject>(): FluentRulesGenerator<TObject> {
    return new FluentRulesGenerator<TObject>(new FluentEnsure<TObject>(ValidationRules.parser)).ensureObject();
  }

  /**
   * Defines a custom rule.
   * @param name The name of the custom rule. Also serves as the message key.
   * @param condition The rule function.
   * @param message The message expression
   * @param argsToConfig A function that maps the rule's arguments to a "config" 
   * object that can be used when evaluating the message expression.
   */
  public static customRule(
    name: string,
    condition: (value: any, object?: any, ...args: any[]) => boolean | Promise<boolean>,
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
  public static taggedRules(rules: Rule<any, any>[][], tag: string): Rule<any, any>[][] {
    return rules.map(x => x.filter(r => r.tag === tag));
  }

  /**
   * Removes the rules from a class or object.
   * @param target A class or object.
   */
  public static off(target: any): void {
    Rules.unset(target);
  }
}
