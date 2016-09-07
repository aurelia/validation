System.register(['aurelia-templating', '../validator', '../validation-error', './rules', './validation-messages'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var aurelia_templating_1, validator_1, validation_error_1, rules_1, validation_messages_1;
    var StandardValidator;
    return {
        setters:[
            function (aurelia_templating_1_1) {
                aurelia_templating_1 = aurelia_templating_1_1;
            },
            function (validator_1_1) {
                validator_1 = validator_1_1;
            },
            function (validation_error_1_1) {
                validation_error_1 = validation_error_1_1;
            },
            function (rules_1_1) {
                rules_1 = rules_1_1;
            },
            function (validation_messages_1_1) {
                validation_messages_1 = validation_messages_1_1;
            }],
        execute: function() {
            /**
             * Validates.
             * Responsible for validating objects and properties.
             */
            StandardValidator = (function (_super) {
                __extends(StandardValidator, _super);
                function StandardValidator(messageProvider, resources) {
                    _super.call(this);
                    this.messageProvider = messageProvider;
                    this.lookupFunctions = resources.lookupFunctions;
                    this.getDisplayName = messageProvider.getDisplayName.bind(messageProvider);
                }
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
                StandardValidator.prototype.validate = function (object, propertyName, rules) {
                    var _this = this;
                    var errors = [];
                    // rules specified?
                    if (!rules) {
                        // no. locate the rules via metadata.
                        rules = rules_1.Rules.get(object);
                    }
                    // any rules?
                    if (!rules) {
                        return Promise.resolve(errors);
                    }
                    // are we validating all properties or a single property?
                    var validateAllProperties = propertyName === null || propertyName === undefined;
                    var addError = function (rule, value) {
                        var message = _this.getMessage(rule, object, value);
                        errors.push(new validation_error_1.ValidationError(rule, message, object, rule.property.name));
                    };
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
                        if (promiseOrBoolean instanceof Promise) {
                            promises.push(promiseOrBoolean.then(function (isValid) {
                                if (!isValid) {
                                    addError(rule, value);
                                }
                            }));
                            return "continue";
                        }
                        if (!promiseOrBoolean) {
                            addError(rule, value);
                        }
                    };
                    for (var i = 0; i < rules.length; i++) {
                        _loop_1(i);
                    }
                    if (promises.length === 0) {
                        return Promise.resolve(errors);
                    }
                    return Promise.all(promises).then(function () { return errors; });
                };
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
                StandardValidator.inject = [validation_messages_1.ValidationMessageProvider, aurelia_templating_1.ViewResources];
                return StandardValidator;
            }(validator_1.Validator));
            exports_1("StandardValidator", StandardValidator);
        }
    }
});
