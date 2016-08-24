import { ViewResources } from 'aurelia-templating';
import { Validator } from '../validator';
import { ValidationError } from '../validation-error';
import { ValidationMessageProvider } from './validation-messages';
/**
 * Validates.
 * Responsible for validating objects and properties.
 */
export declare class StandardValidator extends Validator {
    static inject: (typeof ViewResources | typeof ValidationMessageProvider)[];
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
