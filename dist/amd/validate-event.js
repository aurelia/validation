define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidateEvent = (function () {
        function ValidateEvent(
            /**
             * The type of validate event. Either "validate" or "reset".
             */
            type, 
            /**
             * The controller's current array of errors. For an array containing both
             * failed rules and passed rules, use the "results" property.
             */
            errors, 
            /**
             * The controller's current array of validate results. This
             * includes both passed rules and failed rules. For an array of only failed rules,
             * use the "errors" property.
             */
            results, 
            /**
             * The instruction passed to the "validate" or "reset" event. Will be null when
             * the controller's validate/reset method was called with no instruction argument.
             */
            instruction, 
            /**
             * In events with type === "validate", this property will contain the result
             * of validating the instruction (see "instruction" property). Use the controllerValidateResult
             * to access the validate results specific to the call to "validate"
             * (as opposed to using the "results" and "errors" properties to access the controller's entire
             * set of results/errors).
             */
            controllerValidateResult) {
            this.type = type;
            this.errors = errors;
            this.results = results;
            this.instruction = instruction;
            this.controllerValidateResult = controllerValidateResult;
        }
        return ValidateEvent;
    }());
    exports.ValidateEvent = ValidateEvent;
});
