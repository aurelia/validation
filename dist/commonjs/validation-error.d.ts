/**
 * A validation error.
 */
export declare class ValidationError {
    rule: any;
    message: string;
    object: any;
    propertyName: string | null;
    private static nextId;
    /**
     * A number that uniquely identifies the error instance.
     */
    id: number;
    /**
     * @param rule The rule associated with the error. Validator implementation specific.
     * @param message The error message.
     * @param object The invalid object
     * @param propertyName The name of the invalid property. Optional.
     */
    constructor(rule: any, message: string, object: any, propertyName?: string | null);
}
