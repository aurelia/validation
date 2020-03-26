import { AccessKeyed, AccessMember, AccessScope, Binary, Binding, BindingBehavior, CallMember, Conditional, Expression, LiteralPrimitive, LiteralString, Parser, Scope, ValueConverter } from 'aurelia-binding';
import { Container, Lazy } from 'aurelia-dependency-injection';
import { DOM } from 'aurelia-pal';
import { TaskQueue } from 'aurelia-task-queue';
import { BindingLanguage, ViewResources } from 'aurelia-templating';

/**
 * The result of validating an individual validation rule.
 */
export declare class ValidateResult {
	rule: any;
	object: any;
	propertyName: string | number | null;
	valid: boolean;
	message: string | null;
	private static nextId;
	/**
	 * A number that uniquely identifies the result instance.
	 */
	id: number;
	/**
	 * @param rule The rule associated with the result. Validator implementation specific.
	 * @param object The object that was validated.
	 * @param propertyName The name of the property that was validated.
	 * @param error The error, if the result is a validation error.
	 */
	constructor(rule: any, object: any, propertyName: string | number | null, valid: boolean, message?: string | null);
	toString(): string | null;
}
/**
 * Validates objects and properties.
 */
export declare abstract class Validator {
	/**
	 * Validates the specified property.
	 * @param object The object to validate.
	 * @param propertyName The name of the property to validate.
	 * @param rules Optional. If unspecified, the implementation should lookup the rules for the
	 * specified object. This may not be possible for all implementations of this interface.
	 */
	abstract validateProperty(object: any, propertyName: string, rules?: any): Promise<ValidateResult[]>;
	/**
	 * Validates all rules for specified object and it's properties.
	 * @param object The object to validate.
	 * @param rules Optional. If unspecified, the implementation should lookup the rules for the
	 * specified object. This may not be possible for all implementations of this interface.
	 */
	abstract validateObject(object: any, rules?: any): Promise<ValidateResult[]>;
	/**
	 * Determines whether a rule exists in a set of rules.
	 * @param rules The rules to search.
	 * @parem rule The rule to find.
	 */
	abstract ruleExists(rules: any, rule: any): boolean;
}
/**
 * Validation triggers.
 */
export declare enum validateTrigger {
	/**
	 * Manual validation.  Use the controller's `validate()` and  `reset()` methods
	 * to validate all bindings.
	 */
	manual = 0,
	/**
	 * Validate the binding when the binding's target element fires a DOM "blur" event.
	 */
	blur = 1,
	/**
	 * Validate the binding when it updates the model due to a change in the view.
	 */
	change = 2,
	/**
	 * Validate the binding when the binding's target element fires a DOM "blur" event and
	 * when it updates the model due to a change in the view.
	 */
	changeOrBlur = 3,
	/**
	 * Validate the binding when the binding's target element fires a DOM "focusout" event.
	 * Unlike "blur", this event bubbles.
	 */
	focusout = 4,
	/**
	 * Validate the binding when the binding's target element fires a DOM "focusout" event or
	 * when it updates the model due to a change in the view.
	 */
	changeOrFocusout = 6
}
export declare type ValidatorCtor = new (...args: any[]) => Validator;
/**
 * Aurelia Validation Configuration API
 */
export declare class GlobalValidationConfiguration {
	static DEFAULT_VALIDATION_TRIGGER: validateTrigger;
	private validatorType;
	private validationTrigger;
	/**
	 * Use a custom Validator implementation.
	 */
	customValidator(type: ValidatorCtor): this;
	defaultValidationTrigger(trigger: validateTrigger): this;
	getDefaultValidationTrigger(): validateTrigger;
	/**
	 * Applies the configuration.
	 */
	apply(container: Container): void;
}
/**
 * Instructions for the validation controller's validate method.
 */
export interface ValidateInstruction {
	/**
	 * The object to validate.
	 */
	object: any;
	/**
	 * The property to validate. Optional.
	 */
	propertyName?: any;
	/**
	 * The rules to validate. Optional.
	 */
	rules?: any;
}
/**
 * The result of a call to the validation controller's validate method.
 */
export interface ControllerValidateResult {
	/**
	 * Whether validation passed.
	 */
	valid: boolean;
	/**
	 * The validation result of every rule that was evaluated.
	 */
	results: ValidateResult[];
	/**
	 * The instruction passed to the controller's validate method.
	 */
	instruction?: ValidateInstruction;
}
/**
 * Gets the DOM element associated with the data-binding. Most of the time it's
 * the binding.target but sometimes binding.target is an aurelia custom element,
 * or custom attribute which is a javascript "class" instance, so we need to use
 * the controller's container to retrieve the actual DOM element.
 */
export declare function getTargetDOMElement(binding: any, view: any): Element;
/**
 * Retrieves the object and property name for the specified expression.
 * @param expression The expression
 * @param source The scope
 */
export declare function getPropertyInfo(expression: Expression, source: Scope): {
	object: object;
	propertyName: string;
} | null;
export declare type PropertyAccessor<TObject, TValue> = (object: TObject) => TValue;
export declare class PropertyAccessorParser {
	private parser;
	static inject: (typeof Parser)[];
	constructor(parser: Parser);
	parse<TObject, TValue>(property: string | number | PropertyAccessor<TObject, TValue>): string | number;
}
export declare function getAccessorExpression(fn: string): string;
/**
 * A result to render (or unrender) and the associated elements (if any)
 */
export interface ResultInstruction {
	/**
	 * The validation result.
	 */
	result: ValidateResult;
	/**
	 * The associated elements (if any).
	 */
	elements: Element[];
}
/**
 * Defines which validation results to render and which validation results to unrender.
 */
export interface RenderInstruction {
	/**
	 * The "kind" of render instruction. Either 'validate' or 'reset'.
	 */
	kind: 'validate' | 'reset';
	/**
	 * The results to render.
	 */
	render: ResultInstruction[];
	/**
	 * The results to unrender.
	 */
	unrender: ResultInstruction[];
}
/**
 * Renders validation results.
 */
export interface ValidationRenderer {
	/**
	 * Render the validation results.
	 * @param instruction The render instruction. Defines which results to render and which
	 * results to unrender.
	 */
	render(instruction: RenderInstruction): void;
}
export declare class ValidateEvent {
	/**
	 * The type of validate event. Either "validate" or "reset".
	 */
	readonly type: 'validate' | 'reset';
	/**
	 * The controller's current array of errors. For an array containing both
	 * failed rules and passed rules, use the "results" property.
	 */
	readonly errors: ValidateResult[];
	/**
	 * The controller's current array of validate results. This
	 * includes both passed rules and failed rules. For an array of only failed rules,
	 * use the "errors" property.
	 */
	readonly results: ValidateResult[];
	/**
	 * The instruction passed to the "validate" or "reset" event. Will be null when
	 * the controller's validate/reset method was called with no instruction argument.
	 */
	readonly instruction: ValidateInstruction | null;
	/**
	 * In events with type === "validate", this property will contain the result
	 * of validating the instruction (see "instruction" property). Use the controllerValidateResult
	 * to access the validate results specific to the call to "validate"
	 * (as opposed to using the "results" and "errors" properties to access the controller's entire
	 * set of results/errors).
	 */
	readonly controllerValidateResult: ControllerValidateResult | null;
	constructor(
	/**
	 * The type of validate event. Either "validate" or "reset".
	 */
	type: 'validate' | 'reset', 
	/**
	 * The controller's current array of errors. For an array containing both
	 * failed rules and passed rules, use the "results" property.
	 */
	errors: ValidateResult[], 
	/**
	 * The controller's current array of validate results. This
	 * includes both passed rules and failed rules. For an array of only failed rules,
	 * use the "errors" property.
	 */
	results: ValidateResult[], 
	/**
	 * The instruction passed to the "validate" or "reset" event. Will be null when
	 * the controller's validate/reset method was called with no instruction argument.
	 */
	instruction: ValidateInstruction | null, 
	/**
	 * In events with type === "validate", this property will contain the result
	 * of validating the instruction (see "instruction" property). Use the controllerValidateResult
	 * to access the validate results specific to the call to "validate"
	 * (as opposed to using the "results" and "errors" properties to access the controller's entire
	 * set of results/errors).
	 */
	controllerValidateResult: ControllerValidateResult | null);
}
/**
 * Orchestrates validation.
 * Manages a set of bindings, renderers and objects.
 * Exposes the current list of validation results for binding purposes.
 */
export declare class ValidationController {
	private validator;
	private propertyParser;
	static inject: (typeof Validator | typeof GlobalValidationConfiguration | typeof PropertyAccessorParser)[];
	private bindings;
	private renderers;
	/**
	 * Validation results that have been rendered by the controller.
	 */
	private results;
	/**
	 * Validation errors that have been rendered by the controller.
	 */
	errors: ValidateResult[];
	/**
	 *  Whether the controller is currently validating.
	 */
	validating: boolean;
	private elements;
	private objects;
	/**
	 * The trigger that will invoke automatic validation of a property used in a binding.
	 */
	validateTrigger: validateTrigger;
	private finishValidating;
	private eventCallbacks;
	constructor(validator: Validator, propertyParser: PropertyAccessorParser, config?: GlobalValidationConfiguration);
	/**
	 * Subscribe to controller validate and reset events. These events occur when the
	 * controller's "validate"" and "reset" methods are called.
	 * @param callback The callback to be invoked when the controller validates or resets.
	 */
	subscribe(callback: (event: ValidateEvent) => void): {
		dispose: () => void;
	};
	/**
	 * Adds an object to the set of objects that should be validated when validate is called.
	 * @param object The object.
	 * @param rules Optional. The rules. If rules aren't supplied the Validator implementation will lookup the rules.
	 */
	addObject(object: any, rules?: any): void;
	/**
	 * Removes an object from the set of objects that should be validated when validate is called.
	 * @param object The object.
	 */
	removeObject(object: any): void;
	/**
	 * Adds and renders an error.
	 */
	addError<TObject>(message: string, object: TObject, propertyName?: string | PropertyAccessor<TObject, string> | null): ValidateResult;
	/**
	 * Removes and unrenders an error.
	 */
	removeError(result: ValidateResult): void;
	/**
	 * Adds a renderer.
	 * @param renderer The renderer.
	 */
	addRenderer(renderer: ValidationRenderer): void;
	/**
	 * Removes a renderer.
	 * @param renderer The renderer.
	 */
	removeRenderer(renderer: ValidationRenderer): void;
	/**
	 * Registers a binding with the controller.
	 * @param binding The binding instance.
	 * @param target The DOM element.
	 * @param rules (optional) rules associated with the binding. Validator implementation specific.
	 */
	registerBinding(binding: Binding, target: Element, rules?: any): void;
	/**
	 * Unregisters a binding with the controller.
	 * @param binding The binding instance.
	 */
	unregisterBinding(binding: Binding): void;
	/**
	 * Interprets the instruction and returns a predicate that will identify
	 * relevant results in the list of rendered validation results.
	 */
	private getInstructionPredicate;
	/**
	 * Validates and renders results.
	 * @param instruction Optional. Instructions on what to validate. If undefined, all
	 * objects and bindings will be validated.
	 */
	validate(instruction?: ValidateInstruction): Promise<ControllerValidateResult>;
	/**
	 * Resets any rendered validation results (unrenders).
	 * @param instruction Optional. Instructions on what to reset. If unspecified all rendered results
	 * will be unrendered.
	 */
	reset(instruction?: ValidateInstruction): void;
	/**
	 * Gets the elements associated with an object and propertyName (if any).
	 */
	private getAssociatedElements;
	private processResultDelta;
	/**
	 * Validates the property associated with a binding.
	 */
	validateBinding(binding: Binding): void;
	/**
	 * Resets the results for a property associated with a binding.
	 */
	resetBinding(binding: Binding): void;
	/**
	 * Changes the controller's validateTrigger.
	 * @param newTrigger The new validateTrigger
	 */
	changeTrigger(newTrigger: validateTrigger): void;
	/**
	 * Revalidates the controller's current set of errors.
	 */
	revalidateErrors(): void;
	private invokeCallbacks;
}
declare abstract class ValidateBindingBehaviorBase {
	private taskQueue;
	constructor(taskQueue: TaskQueue);
	protected abstract getValidateTrigger(controller: ValidationController): validateTrigger;
	bind(binding: any, source: any, rulesOrController?: ValidationController | any, rules?: any): void;
	unbind(binding: any): void;
}
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the validate trigger specified by the associated controller's
 * validateTrigger property occurs.
 */
export declare class ValidateBindingBehavior extends ValidateBindingBehaviorBase {
	static inject: (typeof TaskQueue)[];
	getValidateTrigger(controller: ValidationController): validateTrigger;
}
/**
 * Binding behavior. Indicates the bound property will be validated
 * manually, by calling controller.validate(). No automatic validation
 * triggered by data-entry or blur will occur.
 */
export declare class ValidateManuallyBindingBehavior extends ValidateBindingBehaviorBase {
	static inject: (typeof TaskQueue)[];
	getValidateTrigger(): validateTrigger;
}
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs.
 */
export declare class ValidateOnBlurBindingBehavior extends ValidateBindingBehaviorBase {
	static inject: (typeof TaskQueue)[];
	getValidateTrigger(): validateTrigger;
}
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element is changed by the user, causing a change
 * to the model.
 */
export declare class ValidateOnChangeBindingBehavior extends ValidateBindingBehaviorBase {
	static inject: (typeof TaskQueue)[];
	getValidateTrigger(): validateTrigger;
}
/**
 * Binding behavior. Indicates the bound property should be validated
 * when the associated element blurs or is changed by the user, causing
 * a change to the model.
 */
export declare class ValidateOnChangeOrBlurBindingBehavior extends ValidateBindingBehaviorBase {
	static inject: (typeof TaskQueue)[];
	getValidateTrigger(): validateTrigger;
}
export declare class ValidateOnFocusoutBindingBehavior extends ValidateBindingBehaviorBase {
	static inject: (typeof TaskQueue)[];
	getValidateTrigger(): validateTrigger;
}
export declare class ValidateOnChangeOrFocusoutBindingBehavior extends ValidateBindingBehaviorBase {
	static inject: (typeof TaskQueue)[];
	getValidateTrigger(): validateTrigger;
}
/**
 * Creates ValidationController instances.
 */
export declare class ValidationControllerFactory {
	private container;
	static get(container: Container): ValidationControllerFactory;
	constructor(container: Container);
	/**
	 * Creates a new controller instance.
	 */
	create(validator?: Validator): ValidationController;
	/**
	 * Creates a new controller and registers it in the current element's container so that it's
	 * available to the validate binding behavior and renderers.
	 */
	createForCurrentScope(validator?: Validator): ValidationController;
}
export interface RenderedError {
	error: ValidateResult;
	targets: Element[];
}
export declare class ValidationErrorsCustomAttribute implements ValidationRenderer {
	private boundaryElement;
	private controllerAccessor;
	static inject(): [typeof DOM.Element, Lazy<ValidationController>];
	controller: ValidationController | null;
	errors: RenderedError[];
	private errorsInternal;
	constructor(boundaryElement: Element, controllerAccessor: () => ValidationController);
	sort(): void;
	interestingElements(elements: Element[]): Element[];
	render(instruction: RenderInstruction): void;
	bind(): void;
	unbind(): void;
}
export declare class ValidationRendererCustomAttribute {
	private container;
	private controller;
	private value;
	private renderer;
	created(view: any): void;
	bind(): void;
	unbind(): void;
}
export declare type ValidationDisplayNameAccessor = () => string;
/**
 * Information related to a property that is the subject of validation.
 */
export interface RuleProperty {
	/**
	 * The property name. null indicates the rule targets the object itself.
	 */
	name: string | number | null;
	/**
	 * The displayName of the property (or object).
	 */
	displayName: string | ValidationDisplayNameAccessor | null;
}
/**
 * A rule definition. Associations a rule with a property or object.
 */
export interface Rule<TObject, TValue> {
	property: RuleProperty;
	condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>;
	config: object;
	when: ((object: TObject) => boolean) | null;
	messageKey: string;
	message: Expression | null;
	sequence: number;
	tag?: string;
}
/**
 * Sets, unsets and retrieves rules on an object or constructor function.
 */
export declare class Rules {
	/**
	 * The name of the property that stores the rules.
	 */
	private static key;
	/**
	 * Applies the rules to a target.
	 */
	static set(target: any, rules: Rule<any, any>[][]): void;
	/**
	 * Removes rules from a target.
	 */
	static unset(target: any): void;
	/**
	 * Retrieves the target's rules.
	 */
	static get(target: any): Rule<any, any>[][] | null;
}
declare class ExpressionVisitor {
	visitChain(chain: any): void;
	visitBindingBehavior(behavior: BindingBehavior): void;
	visitValueConverter(converter: ValueConverter): void;
	visitAssign(assign: any): void;
	visitConditional(conditional: Conditional): void;
	visitAccessThis(access: any): void;
	visitAccessScope(access: AccessScope): void;
	visitAccessMember(access: AccessMember): void;
	visitAccessKeyed(access: AccessKeyed): void;
	visitCallScope(call: any): void;
	visitCallFunction(call: any): void;
	visitCallMember(call: CallMember): void;
	visitPrefix(prefix: any): void;
	visitBinary(binary: Binary): void;
	visitLiteralPrimitive(literal: LiteralPrimitive): void;
	visitLiteralArray(literal: any): void;
	visitLiteralObject(literal: any): void;
	visitLiteralString(literal: LiteralString): void;
	private visitArgs;
}
export declare class ValidationMessageParser {
	private bindinqLanguage;
	static inject: (typeof BindingLanguage)[];
	private emptyStringExpression;
	private nullExpression;
	private undefinedExpression;
	private cache;
	constructor(bindinqLanguage: BindingLanguage);
	parse(message: string): Expression;
	private coalesce;
}
export declare class MessageExpressionValidator extends ExpressionVisitor {
	private originalMessage;
	static validate(expression: Expression, originalMessage: string): void;
	constructor(originalMessage: string);
	visitAccessScope(access: AccessScope): void;
}
export interface ValidationMessages {
	[key: string]: string;
}
/**
 * Dictionary of validation messages. [messageKey]: messageExpression
 */
export declare const validationMessages: ValidationMessages;
/**
 * Retrieves validation messages and property display names.
 */
export declare class ValidationMessageProvider {
	parser: ValidationMessageParser;
	static inject: (typeof ValidationMessageParser)[];
	constructor(parser: ValidationMessageParser);
	/**
	 * Returns a message binding expression that corresponds to the key.
	 * @param key The message key.
	 */
	getMessage(key: string): Expression;
	/**
	 * Formulates a property display name using the property name and the configured
	 * displayName (if provided).
	 * Override this with your own custom logic.
	 * @param propertyName The property name.
	 */
	getDisplayName(propertyName: string | number, displayName?: string | null | (() => string)): string;
}
/**
 * Validates.
 * Responsible for validating objects and properties.
 */
export declare class StandardValidator extends Validator {
	static inject: (typeof ViewResources | typeof ValidationMessageProvider)[];
	private messageProvider;
	private lookupFunctions;
	private getDisplayName;
	constructor(messageProvider: ValidationMessageProvider, resources: ViewResources);
	/**
	 * Validates the specified property.
	 * @param object The object to validate.
	 * @param propertyName The name of the property to validate.
	 * @param rules Optional. If unspecified, the rules will be looked up using the metadata
	 * for the object created by ValidationRules....on(class/object)
	 */
	validateProperty(object: any, propertyName: string | number, rules?: any): Promise<ValidateResult[]>;
	/**
	 * Validates all rules for specified object and it's properties.
	 * @param object The object to validate.
	 * @param rules Optional. If unspecified, the rules will be looked up using the metadata
	 * for the object created by ValidationRules....on(class/object)
	 */
	validateObject(object: any, rules?: any): Promise<ValidateResult[]>;
	/**
	 * Determines whether a rule exists in a set of rules.
	 * @param rules The rules to search.
	 * @parem rule The rule to find.
	 */
	ruleExists(rules: Rule<any, any>[][], rule: Rule<any, any>): boolean;
	private getMessage;
	private validateRuleSequence;
	private validate;
}
/**
 * Part of the fluent rule API. Enables customizing property rules.
 */
export declare class FluentRuleCustomizer<TObject, TValue> {
	private fluentEnsure;
	private fluentRules;
	private parsers;
	private rule;
	constructor(property: RuleProperty, condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config: object | undefined, fluentEnsure: FluentEnsure<TObject>, fluentRules: FluentRules<TObject, TValue>, parsers: Parsers);
	/**
	 * Validate subsequent rules after previously declared rules have
	 * been validated successfully. Use to postpone validation of costly
	 * rules until less expensive rules pass validation.
	 */
	then(): this;
	/**
	 * Specifies the key to use when looking up the rule's validation message.
	 */
	withMessageKey(key: string): this;
	/**
	 * Specifies rule's validation message.
	 */
	withMessage(message: string): this;
	/**
	 * Specifies a condition that must be met before attempting to validate the rule.
	 * @param condition A function that accepts the object as a parameter and returns true
	 * or false whether the rule should be evaluated.
	 */
	when(condition: (object: TObject) => boolean): this;
	/**
	 * Tags the rule instance, enabling the rule to be found easily
	 * using ValidationRules.taggedRules(rules, tag)
	 */
	tag(tag: string): this;
	/**
	 * Target a property with validation rules.
	 * @param property The property to target. Can be the property name or a property accessor function.
	 */
	ensure<TValue2>(subject: string | ((model: TObject) => TValue2)): FluentRules<TObject, any>;
	/**
	 * Targets an object with validation rules.
	 */
	ensureObject(): FluentRules<TObject, any>;
	/**
	 * Rules that have been defined using the fluent API.
	 */
	get rules(): Rule<TObject, any>[][];
	/**
	 * Applies the rules to a class or object, making them discoverable by the StandardValidator.
	 * @param target A class or object.
	 */
	on(target: any): FluentEnsure<TObject>;
	/**
	 * Applies an ad-hoc rule function to the ensured property or object.
	 * @param condition The function to validate the rule.
	 * Will be called with two arguments, the property value and the object.
	 * Should return a boolean or a Promise that resolves to a boolean.
	 */
	satisfies(condition: (value: TValue, object: TObject) => boolean | Promise<boolean>, config?: object): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies a rule by name.
	 * @param name The name of the custom or standard rule.
	 * @param args The rule's arguments.
	 */
	satisfiesRule(name: string, ...args: any[]): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "required" rule to the property.
	 * The value cannot be null, undefined or whitespace.
	 */
	required(): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "matches" rule to the property.
	 * Value must match the specified regular expression.
	 * null, undefined and empty-string values are considered valid.
	 */
	matches(regex: RegExp): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "email" rule to the property.
	 * null, undefined and empty-string values are considered valid.
	 */
	email(): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "minLength" STRING validation rule to the property.
	 * null, undefined and empty-string values are considered valid.
	 */
	minLength(length: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "maxLength" STRING validation rule to the property.
	 * null, undefined and empty-string values are considered valid.
	 */
	maxLength(length: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "minItems" ARRAY validation rule to the property.
	 * null and undefined values are considered valid.
	 */
	minItems(count: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "maxItems" ARRAY validation rule to the property.
	 * null and undefined values are considered valid.
	 */
	maxItems(count: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "min" NUMBER validation rule to the property.
	 * Value must be greater than or equal to the specified constraint.
	 * null and undefined values are considered valid.
	 */
	min(value: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "max" NUMBER validation rule to the property.
	 * Value must be less than or equal to the specified constraint.
	 * null and undefined values are considered valid.
	 */
	max(value: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "range" NUMBER validation rule to the property.
	 * Value must be between or equal to the specified min and max.
	 * null and undefined values are considered valid.
	 */
	range(min: number, max: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "between" NUMBER validation rule to the property.
	 * Value must be between but not equal to the specified min and max.
	 * null and undefined values are considered valid.
	 */
	between(min: number, max: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "equals" validation rule to the property.
	 * null, undefined and empty-string values are considered valid.
	 */
	equals(expectedValue: TValue): FluentRuleCustomizer<TObject, TValue>;
}
/**
 * Part of the fluent rule API. Enables applying rules to properties and objects.
 */
export declare class FluentRules<TObject, TValue> {
	private fluentEnsure;
	private parsers;
	private property;
	static customRules: {
		[name: string]: {
			condition: (value: any, object?: any, ...fluentArgs: any[]) => boolean | Promise<boolean>;
			argsToConfig?: (...args: any[]) => any;
		};
	};
	/**
	 * Current rule sequence number. Used to postpone evaluation of rules until rules
	 * with lower sequence number have successfully validated. The "then" fluent API method
	 * manages this property, there's usually no need to set it directly.
	 */
	sequence: number;
	constructor(fluentEnsure: FluentEnsure<TObject>, parsers: Parsers, property: RuleProperty);
	/**
	 * Sets the display name of the ensured property.
	 */
	displayName(name: string | ValidationDisplayNameAccessor | null): this;
	/**
	 * Applies an ad-hoc rule function to the ensured property or object.
	 * @param condition The function to validate the rule.
	 * Will be called with two arguments, the property value and the object.
	 * Should return a boolean or a Promise that resolves to a boolean.
	 */
	satisfies(condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config?: object): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies a rule by name.
	 * @param name The name of the custom or standard rule.
	 * @param args The rule's arguments.
	 */
	satisfiesRule(name: string, ...args: any[]): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "required" rule to the property.
	 * The value cannot be null, undefined or whitespace.
	 */
	required(): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "matches" rule to the property.
	 * Value must match the specified regular expression.
	 * null, undefined and empty-string values are considered valid.
	 */
	matches(regex: RegExp): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "email" rule to the property.
	 * null, undefined and empty-string values are considered valid.
	 */
	email(): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "minLength" STRING validation rule to the property.
	 * null, undefined and empty-string values are considered valid.
	 */
	minLength(length: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "maxLength" STRING validation rule to the property.
	 * null, undefined and empty-string values are considered valid.
	 */
	maxLength(length: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "minItems" ARRAY validation rule to the property.
	 * null and undefined values are considered valid.
	 */
	minItems(count: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "maxItems" ARRAY validation rule to the property.
	 * null and undefined values are considered valid.
	 */
	maxItems(count: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "min" NUMBER validation rule to the property.
	 * Value must be greater than or equal to the specified constraint.
	 * null and undefined values are considered valid.
	 */
	min(constraint: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "max" NUMBER validation rule to the property.
	 * Value must be less than or equal to the specified constraint.
	 * null and undefined values are considered valid.
	 */
	max(constraint: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "range" NUMBER validation rule to the property.
	 * Value must be between or equal to the specified min and max.
	 * null and undefined values are considered valid.
	 */
	range(min: number, max: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "between" NUMBER validation rule to the property.
	 * Value must be between but not equal to the specified min and max.
	 * null and undefined values are considered valid.
	 */
	between(min: number, max: number): FluentRuleCustomizer<TObject, TValue>;
	/**
	 * Applies the "equals" validation rule to the property.
	 * null and undefined values are considered valid.
	 */
	equals(expectedValue: TValue): FluentRuleCustomizer<TObject, TValue>;
}
/**
 * Part of the fluent rule API. Enables targeting properties and objects with rules.
 */
export declare class FluentEnsure<TObject> {
	private parsers;
	/**
	 * Rules that have been defined using the fluent API.
	 */
	rules: Rule<TObject, any>[][];
	constructor(parsers: Parsers);
	/**
	 * Target a property with validation rules.
	 * @param property The property to target. Can be the property name or a property accessor
	 * function.
	 */
	ensure<TValue>(property: string | number | PropertyAccessor<TObject, TValue>): FluentRules<TObject, any>;
	/**
	 * Targets an object with validation rules.
	 */
	ensureObject(): FluentRules<TObject, any>;
	/**
	 * Applies the rules to a class or object, making them discoverable by the StandardValidator.
	 * @param target A class or object.
	 */
	on(target: any): this;
	private assertInitialized;
	private mergeRules;
}
/**
 * Fluent rule definition API.
 */
export declare class ValidationRules {
	private static parsers;
	static initialize(messageParser: ValidationMessageParser, propertyParser: PropertyAccessorParser): void;
	/**
	 * Target a property with validation rules.
	 * @param property The property to target. Can be the property name or a property accessor function.
	 */
	static ensure<TObject, TValue>(property: string | number | PropertyAccessor<TObject, TValue>): FluentRules<TObject, any>;
	/**
	 * Targets an object with validation rules.
	 */
	static ensureObject<TObject>(): FluentRules<TObject, any>;
	/**
	 * Defines a custom rule.
	 * @param name The name of the custom rule. Also serves as the message key.
	 * @param condition The rule function.
	 * @param message The message expression
	 * @param argsToConfig A function that maps the rule's arguments to a "config"
	 * object that can be used when evaluating the message expression.
	 */
	static customRule(name: string, condition: (value: any, object?: any, ...args: any[]) => boolean | Promise<boolean>, message: string, argsToConfig?: (...args: any[]) => any): void;
	/**
	 * Returns rules with the matching tag.
	 * @param rules The rules to search.
	 * @param tag The tag to search for.
	 */
	static taggedRules(rules: Rule<any, any>[][], tag: string): Rule<any, any>[][];
	/**
	 * Returns rules that have no tag.
	 * @param rules The rules to search.
	 */
	static untaggedRules(rules: Rule<any, any>[][]): Rule<any, any>[][];
	/**
	 * Removes the rules from a class or object.
	 * @param target A class or object.
	 */
	static off(target: any): void;
}
export interface Parsers {
	message: ValidationMessageParser;
	property: PropertyAccessorParser;
}
/**
 * Configures the plugin.
 */
export declare function configure(frameworkConfig: {
	container: Container;
	globalResources?: (...resources: any[]) => any;
}, callback?: (config: GlobalValidationConfiguration) => void): void;