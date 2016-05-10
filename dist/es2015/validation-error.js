export let ValidationError = class ValidationError {
  constructor(data) {
    this.message = '';
    this.propertyName = '';

    Object.assign(this, data);
  }
};