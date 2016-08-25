/**
 * A validation error.
 */
export class ValidationError {
    /**
     * @param rule The rule associated with the error. Validator implementation specific.
     * @param message The error message.
     * @param object The invalid object
     * @param propertyName The name of the invalid property. Optional.
     */
    constructor(rule, message, object, propertyName = null) {
        this.rule = rule;
        this.message = message;
        this.object = object;
        this.propertyName = propertyName;
        this.id = ValidationError.nextId++;
    }
}
ValidationError.nextId = 0;
