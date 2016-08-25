System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ValidationError;
    return {
        setters:[],
        execute: function() {
            /**
             * A validation error.
             */
            ValidationError = (function () {
                /**
                 * @param rule The rule associated with the error. Validator implementation specific.
                 * @param message The error message.
                 * @param object The invalid object
                 * @param propertyName The name of the invalid property. Optional.
                 */
                function ValidationError(rule, message, object, propertyName) {
                    if (propertyName === void 0) { propertyName = null; }
                    this.rule = rule;
                    this.message = message;
                    this.object = object;
                    this.propertyName = propertyName;
                    this.id = ValidationError.nextId++;
                }
                ValidationError.nextId = 0;
                return ValidationError;
            }());
            exports_1("ValidationError", ValidationError);
        }
    }
});
