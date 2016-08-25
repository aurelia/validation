declare module "validation-error" {
    /**
     * A validation error.
     */
    export class ValidationError {
        rule: any;
        message: string;
        object: any;
        propertyName: string | null;
        private static nextId;
        /**
         * A number that uniquely identifies the error instance.
         */
        id: number;
        /**
         * @param rule The rule associated with the error. Validator implementation specific.
         * @param message The error message.
         * @param object The invalid object
         * @param propertyName The name of the invalid property. Optional.
         */
        constructor(rule: any, message: string, object: any, propertyName?: string | null);
    }
}
declare module "validator" {
    import { ValidationError } from "validation-error";
    /**
     * Validates.
     * Responsible for validating objects and properties.
     */
    export abstract class Validator {
        /**
         * Validates the specified property.
         * @param object The object to validate.
         * @param propertyName The name of the property to validate.
         * @param rules Optional. If unspecified, the implementation should lookup the rules for the
         * specified object. This may not be possible for all implementations of this interface.
         */
        abstract validateProperty(object: any, propertyName: string, rules?: any): Promise<ValidationError[]>;
        /**
         * Validates all rules for specified object and it's properties.
         * @param object The object to validate.
         * @param rules Optional. If unspecified, the implementation should lookup the rules for the
         * specified object. This may not be possible for all implementations of this interface.
         */
        abstract validateObject(object: any, rules?: any): Promise<ValidationError[]>;
    }
}
declare module "validate-trigger" {
    /**
    * Validation triggers.
    */
    export const validateTrigger: {
        blur: string;
        change: string;
        manual: string;
    };
}
declare module "property-info" {
    import { Expression } from 'aurelia-binding';
    /**
     * Retrieves the object and property name for the specified expression.
     * @param expression The expression
     * @param source The scope
     */
    export function getPropertyInfo(expression: Expression, source: any): {
        object: any;
        propertyName: string;
    };
}
declare module "validation-renderer" {
    import { ValidationError } from "validation-error";
    /**
     * An error to render (or unrender) and the associated elements (if any)
     */
    export interface RenderErrorInstruction {
        /**
         * The validation error.
         */
        error: ValidationError;
        /**
         * The associated elements (if any).
         */
        elements: Element[];
    }
    /**
     * Defines which errors to render and which errors to unrender.
     */
    export interface RenderInstruction {
        /**
         * The errors to render.
         */
        render: RenderErrorInstruction[];
        /**
         * The errors to unrender.
         */
        unrender: RenderErrorInstruction[];
    }
    /**
     * Renders validation errors.
     */
    export interface ValidationRenderer {
        /**
         * Render the errors.
         * @param instruction The render instruction. Defines which errors to render and which
         * errors to unrender.
         */
        render(instruction: RenderInstruction): void;
    }
}
declare module "validation-controller" {
    import { Binding } from 'aurelia-binding';
    import { Validator } from "validator";
    import { ValidationRenderer } from "validation-renderer";
    import { ValidationError } from "validation-error";
    export interface ValidateInstructionBase {
        /**
         * The object to validate.
         */
        object: any;
        /**
         * The property to validate. Optional.
         */
        propertyName?: any;
    }
    /**
     * Validate instructions (what to validate).
     */
    export interface ValidateInstruction extends ValidateInstructionBase {
        /**
         * The rules to validate. Optional.
         */
        rules?: any;
    }
    /**
     * Reset instructions (what to reset).
     */
    export interface ResetInstruction extends ValidateInstructionBase {
    }
    /**
     * Orchestrates validation.
     * Manages a set of bindings, renderers and objects.
     * Exposes the current list of validation errors for binding purposes.
     */
    export class ValidationController {
        private validator;
        static inject: typeof Validator[];
        private bindings;
        private renderers;
        /**
         * Errors that have been rendered by the controller.
         */
        errors: ValidationError[];
        /**
         *  Whether the controller is currently validating.
         */
        validating: boolean;
        private elements;
        private objects;
        /**
         * The trigger that will invoke automatic validation of a property used in a binding.
         */
        validateTrigger: string;
        private finishValidating;
        constructor(validator: Validator);
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
         * Adds and renders a ValidationError.
         */
        addError(message: string, object: any, propertyName?: string): ValidationError;
        /**
         * Removes and unrenders a ValidationError.
         */
        removeError(error: ValidationError): void;
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
         * relevant errors in the list of rendered errors.
         */
        private getInstructionPredicate(instruction?);
        /**
         * Validates and renders errors.
         * @param instruction Optional. Instructions on what to validate. If undefined, all objects and bindings will be validated.
         */
        validate(instruction?: ValidateInstruction): Promise<ValidationError[]>;
        /**
         * Resets any rendered errors (unrenders).
         * @param instruction Optional. Instructions on what to reset. If unspecified all rendered errors will be unrendered.
         */
        reset(instruction?: ResetInstruction): void;
        /**
         * Gets the elements associated with an object and propertyName (if any).
         */
        private getAssociatedElements({object, propertyName});
        private processErrorDelta(oldErrors, newErrors);
        /**
        * Validates the property associated with a binding.
        */
        validateBinding(binding: Binding): void;
        /**
        * Resets the errors for a property associated with a binding.
        */
        resetBinding(binding: Binding): void;
    }
}
declare module "validate-binding-behavior" {
    import { TaskQueue } from 'aurelia-task-queue';
    import { ValidationController } from "validation-controller";
    /**
     * Binding behavior. Indicates the bound property should be validated.
     */
    export class ValidateBindingBehavior {
        private taskQueue;
        static inject: typeof TaskQueue[];
        constructor(taskQueue: TaskQueue);
        /**
        * Gets the DOM element associated with the data-binding. Most of the time it's
        * the binding.target but sometimes binding.target is an aurelia custom element,
        * which is a javascript "class" instance, so we need to use the controller to
        * locate the actual DOM element.
        */
        getTarget(binding: any, view: any): any;
        bind(binding: any, source: any, rulesOrController?: ValidationController | any, rules?: any): void;
        unbind(binding: any): void;
    }
}
declare module "validation-controller-factory" {
    import { Container } from 'aurelia-dependency-injection';
    /**
     * Creates ValidationController instances.
     */
    export class ValidationControllerFactory {
        private container;
        static inject: typeof Container[];
        constructor(container: Container);
        /**
         * Creates a new controller and registers it in the current element's container so that it's
         * available to the validate binding behavior and renderers.
         */
        create(): any;
        /**
         * Creates a new controller and registers it in the current element's container so that it's
         * available to the validate binding behavior and renderers.
         */
        createForCurrentScope(): any;
    }
}
declare module "validation-errors-custom-attribute" {
    import { Lazy } from 'aurelia-dependency-injection';
    import { ValidationController } from "validation-controller";
    import { ValidationError } from "validation-error";
    import { ValidationRenderer, RenderInstruction } from "validation-renderer";
    export interface RenderedError {
        error: ValidationError;
        targets: Element[];
    }
    export class ValidationErrorsCustomAttribute implements ValidationRenderer {
        private boundaryElement;
        private controllerAccessor;
        static inject: ({
            new (): Element;
            prototype: Element;
        } | Lazy)[];
        value: RenderedError[];
        errors: RenderedError[];
        constructor(boundaryElement: Element, controllerAccessor: {
            (): ValidationController;
        });
        sort(): void;
        interestingElements(elements: Element[]): Element[];
        render(instruction: RenderInstruction): void;
        bind(): void;
        unbind(): void;
    }
}
declare module "validation-renderer-custom-attribute" {
    export class ValidationRendererCustomAttribute {
        private container;
        private controller;
        private value;
        private renderer;
        created(view: any): void;
        bind(): void;
        unbind(): void;
    }
}
declare module "implementation/metadata-key" {
    export const metadataKey: string;
}
declare module "implementation/rule" {
    import { Expression } from 'aurelia-binding';
    export interface RuleProperty {
        /**
         * The property name. null indicates the rule targets the object itself.
         */
        name: string | null;
        /**
         * The displayName of the property (or object).
         */
        displayName: string | null;
    }
    export interface Rule<TObject, TValue> {
        property: RuleProperty;
        condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>;
        config: Object;
        when: {
            (object: TObject): boolean;
        } | null;
        messageKey: string;
        message: Expression | null;
        tag?: string;
    }
}
declare module "implementation/util" {
    export function isString(value: any): boolean;
}
declare module "implementation/validation-parser" {
    import { Parser, Expression } from 'aurelia-binding';
    import { BindingLanguage } from 'aurelia-templating';
    import { RuleProperty } from "implementation/rule";
    export interface PropertyAccessor<TObject, TValue> {
        (object: TObject): TValue;
    }
    export class ValidationParser {
        private parser;
        private bindinqLanguage;
        static inject: (typeof Parser | typeof BindingLanguage)[];
        private emptyStringExpression;
        private nullExpression;
        private undefinedExpression;
        constructor(parser: Parser, bindinqLanguage: BindingLanguage);
        private coalesce(part);
        parseMessage(message: string): Expression;
        private getFunctionBody(f);
        private getAccessorExpression(f);
        parseProperty<TObject, TValue>(property: string | PropertyAccessor<TObject, TValue>): RuleProperty;
    }
}
declare module "implementation/validation-messages" {
    import { Expression } from 'aurelia-binding';
    import { ValidationParser } from "implementation/validation-parser";
    export interface ValidationMessages {
        [key: string]: string;
    }
    /**
     * Dictionary of validation messages. [messageKey]: messageExpression
     */
    export const validationMessages: ValidationMessages;
    /**
     * Retrieves validation messages and property display names.
     */
    export class ValidationMessageProvider {
        private parser;
        static inject: typeof ValidationParser[];
        constructor(parser: ValidationParser);
        /**
         * Returns a message binding expression that corresponds to the key.
         * @param key The message key.
         */
        getMessage(key: string): Expression;
        /**
         * When a display name is not provided, this method is used to formulate
         * a display name using the property name.
         * Override this with your own custom logic.
         * @param propertyName The property name.
         */
        computeDisplayName(propertyName: string): string;
    }
}
declare module "implementation/standard-validator" {
    import { ViewResources } from 'aurelia-templating';
    import { Validator } from "validator";
    import { ValidationError } from "validation-error";
    import { ValidationMessageProvider } from "implementation/validation-messages";
    /**
     * Validates.
     * Responsible for validating objects and properties.
     */
    export class StandardValidator extends Validator {
        static inject: (typeof ValidationMessageProvider | typeof ViewResources)[];
        private messageProvider;
        private lookupFunctions;
        constructor(messageProvider: ValidationMessageProvider, resources: ViewResources);
        private getMessage(rule, object, value);
        private validate(object, propertyName, rules);
        /**
         * Validates the specified property.
         * @param object The object to validate.
         * @param propertyName The name of the property to validate.
         * @param rules Optional. If unspecified, the rules will be looked up using the metadata
         * for the object created by ValidationRules....on(class/object)
         */
        validateProperty(object: any, propertyName: string, rules?: any): Promise<ValidationError[]>;
        /**
         * Validates all rules for specified object and it's properties.
         * @param object The object to validate.
         * @param rules Optional. If unspecified, the rules will be looked up using the metadata
         * for the object created by ValidationRules....on(class/object)
         */
        validateObject(object: any, rules?: any): Promise<ValidationError[]>;
    }
}
declare module "implementation/validation-rules" {
    import { Rule, RuleProperty } from "implementation/rule";
    import { ValidationParser, PropertyAccessor } from "implementation/validation-parser";
    /**
     * Part of the fluent rule API. Enables customizing property rules.
     */
    export class FluentRuleCustomizer<TObject, TValue> {
        private fluentEnsure;
        private fluentRules;
        private parser;
        private rule;
        constructor(property: RuleProperty, condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config: Object, fluentEnsure: FluentEnsure<TObject>, fluentRules: FluentRules<TObject, TValue>, parser: ValidationParser);
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
        ensure<TValue2>(subject: string | {
            (model: TObject): TValue2;
        }): FluentRules<TObject, TValue2>;
        /**
         * Targets an object with validation rules.
         */
        ensureObject(): FluentRules<TObject, TObject>;
        /**
         * Rules that have been defined using the fluent API.
         */
        readonly rules: Rule<TObject, any>[];
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
        satisfies(condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config?: Object): FluentRuleCustomizer<TObject, TValue>;
        /**
         * Applies a rule by name.
         * @param name The name of the custom or standard rule.
         * @param args The rule's arguments.
         */
        satisfiesRule(name: string, ...args: any[]): any;
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
    }
    /**
     * Part of the fluent rule API. Enables applying rules to properties and objects.
     */
    export class FluentRules<TObject, TValue> {
        private fluentEnsure;
        private parser;
        private property;
        static customRules: {
            [name: string]: {
                condition: (value: any, object?: any, ...fluentArgs: any[]) => boolean | Promise<boolean>;
                argsToConfig?: (...args: any[]) => any;
            };
        };
        constructor(fluentEnsure: FluentEnsure<TObject>, parser: ValidationParser, property: RuleProperty);
        /**
         * Sets the display name of the ensured property.
         */
        displayName(name: string): this;
        /**
         * Applies an ad-hoc rule function to the ensured property or object.
         * @param condition The function to validate the rule.
         * Will be called with two arguments, the property value and the object.
         * Should return a boolean or a Promise that resolves to a boolean.
         */
        satisfies(condition: (value: TValue, object?: TObject) => boolean | Promise<boolean>, config?: Object): FluentRuleCustomizer<TObject, TValue>;
        /**
         * Applies a rule by name.
         * @param name The name of the custom or standard rule.
         * @param args The rule's arguments.
         */
        satisfiesRule(name: string, ...args: any[]): any;
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
    }
    /**
     * Part of the fluent rule API. Enables targeting properties and objects with rules.
     */
    export class FluentEnsure<TObject> {
        private parser;
        /**
         * Rules that have been defined using the fluent API.
         */
        rules: Rule<TObject, any>[];
        constructor(parser: ValidationParser);
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        ensure<TValue>(property: string | PropertyAccessor<TObject, TValue>): FluentRules<TObject, TValue>;
        /**
         * Targets an object with validation rules.
         */
        ensureObject(): FluentRules<TObject, TObject>;
        /**
         * Applies the rules to a class or object, making them discoverable by the StandardValidator.
         * @param target A class or object.
         */
        on(target: any): this;
        private assertInitialized();
    }
    /**
     * Fluent rule definition API.
     */
    export class ValidationRules {
        private static parser;
        static initialize(parser: ValidationParser): void;
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        static ensure<TObject, TValue>(property: string | PropertyAccessor<TObject, TValue>): FluentRules<TObject, TValue>;
        /**
         * Targets an object with validation rules.
         */
        static ensureObject<TObject>(): FluentRules<TObject, TObject>;
        /**
         * Defines a custom rule.
         * @param name The name of the custom rule. Also serves as the message key.
         * @param condition The rule function.
         * @param message The message expression
         * @param argsToConfig A function that maps the rule's arguments to a "config" object that can be used when evaluating the message expression.
         */
        static customRule(name: string, condition: (value: any, object?: any, ...args: any[]) => boolean | Promise<boolean>, message: string, argsToConfig?: (...args: any[]) => any): void;
        /**
         * Returns rules with the matching tag.
         * @param rules The rules to search.
         * @param tag The tag to search for.
         */
        static taggedRules(rules: Rule<any, any>[], tag: string): Rule<any, any>[];
    }
}
declare module "aurelia-validation" {
    export * from "validate-binding-behavior";
    export * from "validate-trigger";
    export * from "validation-controller";
    export * from "validation-controller-factory";
    export * from "validation-error";
    export * from "validation-errors-custom-attribute";
    export * from "validation-renderer-custom-attribute";
    export * from "validation-renderer";
    export * from "validator";
    export * from "implementation/metadata-key";
    export * from "implementation/rule";
    export * from "implementation/standard-validator";
    export * from "implementation/validation-messages";
    export * from "implementation/validation-parser";
    export * from "implementation/validation-rules";
    import { Container } from 'aurelia-dependency-injection';
    export function configure(frameworkConfig: {
        container: Container;
        globalResources: (...resources: string[]) => any;
    }, config: {
        customValidator?: boolean;
    }): void;
}
