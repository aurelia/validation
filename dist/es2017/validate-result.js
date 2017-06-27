/**
 * The result of validating an individual validation rule.
 */
export class ValidateResult {
    /**
     * @param rule The rule associated with the result. Validator implementation specific.
     * @param object The object that was validated.
     * @param propertyName The name of the property that was validated.
     * @param error The error, if the result is a validation error.
     */
    constructor(rule, object, propertyName, valid, message = null) {
        this.rule = rule;
        this.object = object;
        this.propertyName = propertyName;
        this.valid = valid;
        this.message = message;
        this.id = ValidateResult.nextId++;
    }
    toString() {
        return this.valid ? 'Valid.' : this.message;
    }
}
ValidateResult.nextId = 0;
