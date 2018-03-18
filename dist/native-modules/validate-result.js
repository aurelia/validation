/**
 * The result of validating an individual validation rule.
 */
var ValidateResult = /** @class */ (function () {
    /**
     * @param rule The rule associated with the result. Validator implementation specific.
     * @param object The object that was validated.
     * @param propertyName The name of the property that was validated.
     * @param error The error, if the result is a validation error.
     */
    function ValidateResult(rule, object, propertyName, valid, message) {
        if (message === void 0) { message = null; }
        this.rule = rule;
        this.object = object;
        this.propertyName = propertyName;
        this.valid = valid;
        this.message = message;
        this.id = ValidateResult.nextId++;
    }
    ValidateResult.prototype.toString = function () {
        return this.valid ? 'Valid.' : this.message;
    };
    ValidateResult.nextId = 0;
    return ValidateResult;
}());
export { ValidateResult };
