/**
 * A validation error.
 */
export class ValidationError {
  private static nextId = 0;

  /**
   * A number that uniquely identifies the error instance.
   */
  public id: number;

  /**
   * @param rule The rule associated with the error. Validator implementation specific.
   * @param message The error message.
   * @param object The invalid object
   * @param propertyName The name of the invalid property. Optional.
   */
  constructor(
    public rule: any,
    public message: string,
    public object: any,
    public propertyName: string | null = null
  ) {
    this.id = ValidationError.nextId++;
  }

  public toString() {
    return this.message;
  }
}
