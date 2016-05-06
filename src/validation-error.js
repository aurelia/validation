export class ValidationError {
  message = '';
  object;
  propertyName = '';
  value;
  constructor(data) {
    Object.assign(this, data);
  }
}
