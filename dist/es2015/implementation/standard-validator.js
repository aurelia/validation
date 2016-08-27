import { ViewResources } from 'aurelia-templating';
import { Validator } from '../validator';
import { ValidationError } from '../validation-error';
import { Rules } from './rules';
import { ValidationMessageProvider } from './validation-messages';
/**
 * Validates.
 * Responsible for validating objects and properties.
 */
export class StandardValidator extends Validator {
    constructor(messageProvider, resources) {
        super();
        this.messageProvider = messageProvider;
        this.lookupFunctions = resources.lookupFunctions;
    }
    getMessage(rule, object, value) {
        const expression = rule.message || this.messageProvider.getMessage(rule.messageKey);
        let { name: propertyName, displayName } = rule.property;
        if (displayName === null && propertyName !== null) {
            displayName = this.messageProvider.computeDisplayName(propertyName);
        }
        const overrideContext = {
            $displayName: displayName,
            $propertyName: propertyName,
            $value: value,
            $object: object,
            $config: rule.config
        };
        return expression.evaluate({ bindingContext: object, overrideContext }, this.lookupFunctions);
    }
    validate(object, propertyName, rules) {
        const errors = [];
        // rules specified?
        if (!rules) {
            // no. locate the rules via metadata.
            rules = Rules.get(object);
        }
        // any rules?
        if (!rules) {
            return Promise.resolve(errors);
        }
        // are we validating all properties or a single property?
        const validateAllProperties = propertyName === null || propertyName === undefined;
        const addError = (rule, value) => {
            const message = this.getMessage(rule, object, value);
            errors.push(new ValidationError(rule, message, object, rule.property.name));
        };
        // validate each rule.
        const promises = [];
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            // is the rule related to the property we're validating.
            if (!validateAllProperties && rule.property.name !== propertyName) {
                continue;
            }
            // is this a conditional rule? is the condition met?
            if (rule.when && !rule.when(object)) {
                continue;
            }
            // validate.
            const value = rule.property.name === null ? object : object[rule.property.name];
            const promiseOrBoolean = rule.condition(value, object);
            if (promiseOrBoolean instanceof Promise) {
                promises.push(promiseOrBoolean.then(isValid => {
                    if (!isValid) {
                        addError(rule, value);
                    }
                }));
                continue;
            }
            if (!promiseOrBoolean) {
                addError(rule, value);
            }
        }
        if (promises.length === 0) {
            return Promise.resolve(errors);
        }
        return Promise.all(promises).then(() => errors);
    }
    /**
     * Validates the specified property.
     * @param object The object to validate.
     * @param propertyName The name of the property to validate.
     * @param rules Optional. If unspecified, the rules will be looked up using the metadata
     * for the object created by ValidationRules....on(class/object)
     */
    validateProperty(object, propertyName, rules) {
        return this.validate(object, propertyName, rules || null);
    }
    /**
     * Validates all rules for specified object and it's properties.
     * @param object The object to validate.
     * @param rules Optional. If unspecified, the rules will be looked up using the metadata
     * for the object created by ValidationRules....on(class/object)
     */
    validateObject(object, rules) {
        return this.validate(object, null, rules || null);
    }
}
StandardValidator.inject = [ValidationMessageProvider, ViewResources];
