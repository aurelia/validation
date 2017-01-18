import { Rule, RuleProperty } from './rule';
import { ValidationParser, PropertyAccessor } from './validation-parser';
import { isString } from './util';
import { Rules } from './rules';
import { validationMessages } from './validation-messages';

export class FluentRuleGenerator<TObject> {

  private fluentCustomizer: FluentRuleCustomizer<TObject, any> | null = null;
  private fluentRules: FluentRules<TObject, any> | null = null;

  constructor(
    private fluentEnsure: FluentEnsure<TObject>) {

    if (!fluentEnsure) {
      throw new Error(`FluentRuleGenerator requires an instance of FluentEnsure`);
    }
  }

  /**
   * Target a property with validation rules.
   * @param property The property to target. Can be the property name or a property accessor function.
   */
  public ensure<TValue>(property: string | PropertyAccessor<TObject, TValue>): FluentRuleGenerator<TObject> {
    this.fluentRules = this.fluentEnsure!.ensure(property);
    this.fluentCustomizer = null;
    return this;
  }
  /**
   * Targets an object with validation rules.
   */
  public ensureObject(): FluentRuleGenerator<TObject> {
    this.fluentRules = this.fluentEnsure!.ensureObject();
    this.fluentCustomizer = null;
    return this;
  }
  /**
   * Sets the display name of the ensured property.
   */
  public displayName(name: string): FluentRuleGenerator<TObject> {
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
  public satisfies<TValue>(condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config?: Object): FluentRuleGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.satisfies(condition, config);
    return this;
  }
  /**
   * Applies a rule by name.
   * @param name The name of the custom or standard rule.
   * @param args The rule's arguments.
   */
  public satisfiesRule(name: string, ...args: any[]): FluentRuleGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.satisfiesRule(name, ...args);
    return this;
  }
  /**
   * Applies the "required" rule to the property. 
   * The value cannot be null, undefined or whitespace.
   */
  public required(): FluentRuleGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.required();
    return this;
  }
  /**
   * Applies the "matches" rule to the property.
   * Value must match the specified regular expression.
   * null, undefined and empty-string values are considered valid.
   */
  public matches(regex: RegExp): FluentRuleGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.matches(regex);
    return this;
  }
  /**
   * Applies the "email" rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public email(): FluentRuleGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.email();
    return this;
  }
  /**
   * Applies the "minLength" STRING validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public minLength(length: number): FluentRuleGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.minLength(length);
    return this;
  }
  /**
   * Applies the "maxLength" STRING validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public maxLength(length: number): FluentRuleGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.maxLength(length);
    return this;
  }
  /**
   * Applies the "minItems" ARRAY validation rule to the property.
   * null and undefined values are considered valid.
   */
  public minItems(count: number): FluentRuleGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.minItems(count);
    return this;
  }
  /**
   * Applies the "maxItems" ARRAY validation rule to the property.
   * null and undefined values are considered valid.
   */
  public maxItems(count: number): FluentRuleGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.maxItems(count);
    return this;
  }
  /**
   * Applies the "equals" validation rule to the property.
   * null, undefined and empty-string values are considered valid.
   */
  public equals<TValue>(expectedValue: TValue): FluentRuleGenerator<TObject> {
    this.fluentCustomizer = this.fluentRules!.equals(expectedValue);
    return this;
  }
  /**
   * Validate subsequent rules after previously declared rules have
   * been validated successfully. Use to postpone validation of costly
   * rules until less expensive rules pass validation. 
   */
  public then(): FluentRuleGenerator<TObject> {
    this.assertFluentCustomizer();
    this.fluentCustomizer!.then();
    return this;
  }
  /**
   * Specifies the key to use when looking up the rule's validation message.
   */
  public withMessageKey(key: string): FluentRuleGenerator<TObject> {
    this.assertFluentCustomizer();
    this.fluentCustomizer!.withMessageKey(key);
    return this;
  }
  /**
   * Specifies rule's validation message.
   */
  public withMessage(message: string): FluentRuleGenerator<TObject> {
    this.assertFluentCustomizer();
    this.fluentCustomizer!.withMessage(message);
    return this;
  }
  /**
   * Specifies a condition that must be met before attempting to validate the rule.
   * @param condition A function that accepts the object as a parameter and returns true
   * or false whether the rule should be evaluated.
   */
  public when(condition: (object: TObject) => boolean): FluentRuleGenerator<TObject> {
    this.assertFluentCustomizer();
    this.fluentCustomizer!.when(condition);
    return this;
  }
  /**
   * Tags the rule instance, enabling the rule to be found easily 
   * using ValidationRules.taggedRules(rules, tag)
   */
  public tag(tag: string): FluentRuleGenerator<TObject> {
    this.assertFluentCustomizer();
    this.fluentCustomizer!.tag(tag);
    return this;
  }
  /**
   * Applies the rules to a class or object, making them discoverable by the StandardValidator.
   * @param target A class or object.
   */
  public on(target: any): FluentRuleGenerator<TObject> {
    this.fluentEnsure!.on(target);
    return this;
  }
  /**
   * Rules that have been defined using the fluent API.
   */
  public get rules(): Rule<TObject, any>[][] {
    return this.fluentEnsure!.rules;
  }

  private assertFluentCustomizer(): void | never {
    if (!this.fluentCustomizer) {
      throw new Error(`Invalid call sequence.  Are you trying to modify a rule that has not be defined?`);
    }
  }
}

/**
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
  public then() {
    this.fluentRules.sequence++;
    return this;
  }

  /**
   * Specifies the key to use when looking up the rule's validation message.
   */
  public withMessageKey(key: string) {
    this.rule.messageKey = key;
    this.rule.message = null;
    return this;
  }

  /**
   * Specifies rule's validation message.
   */
  public withMessage(message: string) {
    this.rule.messageKey = 'custom';
    this.rule.message = this.parser.parseMessage(message);
    return this;
  }

  /**
   * Specifies a condition that must be met before attempting to validate the rule.
   * @param condition A function that accepts the object as a parameter and returns true
   * or false whether the rule should be evaluated.
   */
  public when(condition: (object: TObject) => boolean) {
    this.rule.when = condition;
    return this;
  }

  /**
   * Tags the rule instance, enabling the rule to be found easily 
   * using ValidationRules.taggedRules(rules, tag)
   */
  public tag(tag: string) {
    this.rule.tag = tag;
    return this;
  }
}

/**
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
  public satisfies(condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config?: Object) {
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
 * Part of the fluent rule API. Enables targeting properties and objects with rules.
 */
export class FluentEnsure<TObject> {
  /**
   * Rules that have been defined using the fluent API.
   */
  public rules: Rule<TObject, any>[][] = [];

  constructor(private parser: ValidationParser) { }

  /**
   * Target a property with validation rules.
   * @param property The property to target. Can be the property name or a property accessor 
   * function.
   */
  public ensure<TValue>(property: string | PropertyAccessor<TObject, TValue>) {
    this.assertInitialized();

    const ruleProperty = this.parser.parseProperty(property);

    // if this property has been previously-ensured we want to use the same RuleProperty object
    const preExistingProperty: RuleProperty | null = this._getPreExistingEnsured(ruleProperty);

    return new FluentRules<TObject, TValue>(this, this.parser,
      preExistingProperty ? preExistingProperty : ruleProperty);
  }

  /**
   * Targets an object with validation rules.
   */
  public ensureObject() {
    this.assertInitialized();

    const ruleProperty: RuleProperty = { name: null, displayName: null };

    // in case this property has been previously-ensured we want to retain any property information
    const preExistingProperty: RuleProperty | null = this._getPreExistingEnsured(ruleProperty);

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

  /**
   * try to find a RuleProperty by the same given name
   */
  private _getPreExistingEnsured<TValue>(property?: RuleProperty): RuleProperty | null {

    let existingRule: Rule<TObject, TValue> | undefined = undefined;

    const name = property ? property.name : null;

    // note that if name === null then we're looking for the ensured object
    for (const sequence of this.rules) {
      existingRule = sequence.find(r => r.property.name === name);
      if (existingRule) {
        break;
      }
    }

    return existingRule ? existingRule.property : null;
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
  public static ensure<TObject, TValue>(property: string | PropertyAccessor<TObject, TValue>) {
    return new FluentRuleGenerator<TObject>(new FluentEnsure<TObject>(ValidationRules.parser)).ensure(property);
  }

  /**
   * Targets an object with validation rules.
   */
  public static ensureObject<TObject>() {
    return new FluentRuleGenerator<TObject>(new FluentEnsure<TObject>(ValidationRules.parser)).ensureObject();
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
