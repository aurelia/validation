import { ViewResources } from 'aurelia-templating';
import { Validator } from '../validator';
import { ValidationError } from '../validation-error';
import { ValidationMessageProvider } from './validation-messages';
export declare class StandardValidator extends Validator {
    static inject: (typeof ViewResources | typeof ValidationMessageProvider)[];
    private messageProvider;
    private lookupFunctions;
    constructor(messageProvider: ValidationMessageProvider, resources: ViewResources);
    private getMessage(rule, object, value);
    private validate(object, propertyName, rules);
    validateProperty(object: any, propertyName: string, rules?: any): Promise<ValidationError[]>;
    validateObject(object: any, rules?: any): Promise<ValidationError[]>;
}
