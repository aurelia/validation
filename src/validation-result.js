export class ValidationResult {
  constructor() {
    this.isValid = true;
    this.properties = {};
    this.onValidate = null;
  }
  addProperty(name) {
    if (!this.properties[name]) {
      this.properties[name] = new ValidationResultProperty(this);
    }
    return this.properties[name];
  }

  addPropertyValidationCallback(callback) {
    this.onValidate = callback;
    for (var propertyName in this.properties)
      this.properties[propertyName].onValidate(callback);
  }

  checkValidity() {
    for (let propertyName in this.properties) {
      if (!this.properties[propertyName].isValid) {
        this.isValid = false;
        return;
      }
    }
    this.isValid = true;
  }
  clear() {
    this.isValid = true;
  }
}

export class ValidationResultProperty {
  constructor(group) {
    this.group = group;
    this.onValidateCallbacks = [];
    if( group.onValidate )
        this.onValidate(group.onValidate);
    this.clear();
  }
  clear(): void {
    this.isValid = true;
    this.isDirty = false;
    this.message = '';
    this.failingRule = null;
    this.latestValue = null;
    this.notifyObserversOfChange();
  }
  onValidate(onValidateCallback): void {
    this.onValidateCallbacks.push(onValidateCallback);
  }
  notifyObserversOfChange(): void {
    for (let i = 0; i < this.onValidateCallbacks.length; i++) {
      let callback = this.onValidateCallbacks[i];
      callback(this);
    }
  }
  setValidity(validationResponse, shouldBeDirty: boolean): void {
    let notifyObservers = (!this.isDirty && shouldBeDirty)
      || (this.isValid !== validationResponse.isValid)
      || (this.message !== validationResponse.message);

    if (shouldBeDirty) {
      this.isDirty = true;
    }
    this.message = validationResponse.message;
    this.failingRule = validationResponse.failingRule;
    this.isValid = validationResponse.isValid; //Set isValid last in case someone has observed 'isValid'
    this.latestValue = validationResponse.latestValue;
    if (this.isValid !== this.group.isValid) {
      this.group.checkValidity();
    }
    if (notifyObservers) {
      this.notifyObserversOfChange();
    }
  }
}
