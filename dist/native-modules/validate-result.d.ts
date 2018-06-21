/**
 * The result of validating an individual validation rule.
 */
export declare class ValidateResult {
    rule: any;
    object: any;
    propertyName: string | number | null;
    valid: boolean;
    message: string | null;
    private static nextId;
    /**
     * A number that uniquely identifies the result instance.
     */
    id: number;
    /**
     * @param rule The rule associated with the result. Validator implementation specific.
     * @param object The object that was validated.
     * @param propertyName The name of the property that was validated.
     * @param error The error, if the result is a validation error.
     */
    constructor(rule: any, object: any, propertyName: string | number | null, valid: boolean, message?: string | null);
    toString(): string | null;
}
