export class ValidationResult {
  constructor() {
    this.isValid = true;
    this.properties = {};
  }

  addProperty(name) {
    if (!this.properties[name]) {
      this.properties[name] = new ValidationResultProperty(this);
    }
    return this.properties[name];
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
}

export class ValidationResultProperty {
  constructor(group) {
    this.group = group;
    this.isValid = true;
    this.isDirty = false;
    this.message = null;
    this.failingRule = null;
    this.onValidateCallbacks = [];
    this.latestValue = null;
  }

  onValidate(onValidateCallback) {
    this.onValidateCallbacks.push(onValidateCallback);
  }

  setValidity(validationResponse, shouldBeDirty) {
    var notifyObservers = (!this.isDirty && shouldBeDirty)
      || (this.isValid !== validationResponse.isValid)
      || (this.message !== validationResponse.message);


    if (shouldBeDirty)
      this.isDirty = true;
    this.message = validationResponse.message;
    this.failingRule = validationResponse.failingRule;
    this.isValid = validationResponse.isValid; //Set isValid last in case someone has observed 'isValid'
    this.latestValue = validationResponse.latestValue;
    if (this.isValid !== this.group.isValid)
      this.group.checkValidity();

    if (notifyObservers) {
      for (var i = 0; i < this.onValidateCallbacks.length; i++) {
        var callback = this.onValidateCallbacks[i];
        callback(this);
      }
    }
  }
}
