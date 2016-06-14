export let ValidationError = class ValidationError {

  constructor(rule, message, object, propertyName = null) {
    this.rule = rule;
    this.message = message;
    this.object = object;
    this.propertyName = propertyName || null;
  }
};