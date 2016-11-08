var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { ViewResources } from 'aurelia-templating';
import { Validator } from '../validator';
import { ValidationError } from '../validation-error';
import { Rules } from './rules';
import { ValidationMessageProvider } from './validation-messages';
/**
 * Validates.
 * Responsible for validating objects and properties.
 */
export var StandardValidator = (function (_super) {
    __extends(StandardValidator, _super);
    function StandardValidator(messageProvider, resources) {
        _super.call(this);
        this.messageProvider = messageProvider;
        this.lookupFunctions = resources.lookupFunctions;
        this.getDisplayName = messageProvider.getDisplayName.bind(messageProvider);
    }
    /**
     * Validates the specified property.
     * @param object The object to validate.
     * @param propertyName The name of the property to validate.
     * @param rules Optional. If unspecified, the rules will be looked up using the metadata
     * for the object created by ValidationRules....on(class/object)
     */
    StandardValidator.prototype.validateProperty = function (object, propertyName, rules) {
        return this.validate(object, propertyName, rules || null);
    };
    /**
     * Validates all rules for specified object and it's properties.
     * @param object The object to validate.
     * @param rules Optional. If unspecified, the rules will be looked up using the metadata
     * for the object created by ValidationRules....on(class/object)
     */
    StandardValidator.prototype.validateObject = function (object, rules) {
        return this.validate(object, null, rules || null);
    };
    /**
     * Determines whether a rule exists in a set of rules.
     * @param rules The rules to search.
     * @parem rule The rule to find.
     */
    StandardValidator.prototype.ruleExists = function (rules, rule) {
        var i = rules.length;
        while (i--) {
            if (rules[i].indexOf(rule) !== -1) {
                return true;
            }
        }
        return false;
    };
    StandardValidator.prototype.getMessage = function (rule, object, value) {
        var expression = rule.message || this.messageProvider.getMessage(rule.messageKey);
        var _a = rule.property, propertyName = _a.name, displayName = _a.displayName;
        if (displayName === null && propertyName !== null) {
            displayName = this.messageProvider.getDisplayName(propertyName);
        }
        var overrideContext = {
            $displayName: displayName,
            $propertyName: propertyName,
            $value: value,
            $object: object,
            $config: rule.config,
            $getDisplayName: this.getDisplayName
        };
        return expression.evaluate({ bindingContext: object, overrideContext: overrideContext }, this.lookupFunctions);
    };
    StandardValidator.prototype.validateRuleSequence = function (object, propertyName, ruleSequence, sequence) {
        var _this = this;
        // are we validating all properties or a single property?
        var validateAllProperties = propertyName === null || propertyName === undefined;
        var rules = ruleSequence[sequence];
        var errors = [];
        // validate each rule.
        var promises = [];
        var _loop_1 = function(i) {
            var rule = rules[i];
            // is the rule related to the property we're validating.
            if (!validateAllProperties && rule.property.name !== propertyName) {
                return "continue";
            }
            // is this a conditional rule? is the condition met?
            if (rule.when && !rule.when(object)) {
                return "continue";
            }
            // validate.
            var value = rule.property.name === null ? object : object[rule.property.name];
            var promiseOrBoolean = rule.condition(value, object);
            if (!(promiseOrBoolean instanceof Promise)) {
                promiseOrBoolean = Promise.resolve(promiseOrBoolean);
            }
            promises.push(promiseOrBoolean.then(function (isValid) {
                if (!isValid) {
                    var message = _this.getMessage(rule, object, value);
                    errors.push(new ValidationError(rule, message, object, rule.property.name));
                }
            }));
        };
        for (var i = 0; i < rules.length; i++) {
            _loop_1(i);
        }
        return Promise.all(promises)
            .then(function () {
            sequence++;
            if (errors.length === 0 && sequence < ruleSequence.length) {
                return _this.validateRuleSequence(object, propertyName, ruleSequence, sequence);
            }
            return errors;
        });
    };
    StandardValidator.prototype.validate = function (object, propertyName, rules) {
        // rules specified?
        if (!rules) {
            // no. attempt to locate the rules.
            rules = Rules.get(object);
        }
        // any rules?
        if (!rules) {
            return Promise.resolve([]);
        }
        return this.validateRuleSequence(object, propertyName, rules, 0);
    };
    StandardValidator.inject = [ValidationMessageProvider, ViewResources];
    return StandardValidator;
}(Validator));
