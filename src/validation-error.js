export class ValidationError {
  /**
  * The rule associated with the error.  Validator implementation specific.
  * Can be considered a unique key.
  */
  rule: any;

  /**
  * The error message.
  */
  message: string;

  /**
  * The object associated with the error.
  */
  object: any;

  /**
  * The property associated with the error.  May be null.
  */
  propertyName: string;

  constructor(rule, message, object, propertyName = null) {
    this.rule = rule;
    this.message = message;
    this.object = object;
    this.propertyName = propertyName || null;
  }
}
