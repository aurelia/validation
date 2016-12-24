import { ViewResources } from 'aurelia-templating';
import { Validator } from '../validator';
import { ValidateResult } from '../validate-result';
import { Rule } from './rule';
import { ValidationMessageProvider } from './validation-messages';
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
    validateProperty(object: any, propertyName: string, rules?: any): Promise<ValidateResult[]>;
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
    private getMessage(rule, object, value);
    private validateRuleSequence(object, propertyName, ruleSequence, sequence, results);
    private validate(object, propertyName, rules);
}
