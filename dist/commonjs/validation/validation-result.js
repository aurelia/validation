'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var ValidationResult = (function () {
  function ValidationResult() {
    _classCallCheck(this, ValidationResult);

    this.isValid = true;
    this.properties = {};
  }

  ValidationResult.prototype.addProperty = function addProperty(name) {
    if (!this.properties[name]) {
      this.properties[name] = new ValidationResultProperty(this);
    }
    return this.properties[name];
  };

  ValidationResult.prototype.checkValidity = function checkValidity() {
    for (var propertyName in this.properties) {
      if (!this.properties[propertyName].isValid) {
        this.isValid = false;
        return;
      }
    }
    this.isValid = true;
  };

  ValidationResult.prototype.clear = function clear() {
    this.isValid = true;
  };

  return ValidationResult;
})();

exports.ValidationResult = ValidationResult;

var ValidationResultProperty = (function () {
  function ValidationResultProperty(group) {
    _classCallCheck(this, ValidationResultProperty);

    this.group = group;
    this.onValidateCallbacks = [];
    this.clear();
  }

  ValidationResultProperty.prototype.clear = function clear() {
    this.isValid = true;
    this.isDirty = false;
    this.message = '';
    this.failingRule = null;
    this.latestValue = null;
    this.notifyObserversOfChange();
  };

  ValidationResultProperty.prototype.onValidate = function onValidate(onValidateCallback) {
    this.onValidateCallbacks.push(onValidateCallback);
  };

  ValidationResultProperty.prototype.notifyObserversOfChange = function notifyObserversOfChange() {
    for (var i = 0; i < this.onValidateCallbacks.length; i++) {
      var callback = this.onValidateCallbacks[i];
      callback(this);
    }
  };

  ValidationResultProperty.prototype.setValidity = function setValidity(validationResponse, shouldBeDirty) {
    var notifyObservers = !this.isDirty && shouldBeDirty || this.isValid !== validationResponse.isValid || this.message !== validationResponse.message;

    if (shouldBeDirty) this.isDirty = true;
    this.message = validationResponse.message;
    this.failingRule = validationResponse.failingRule;
    this.isValid = validationResponse.isValid;
    this.latestValue = validationResponse.latestValue;
    if (this.isValid !== this.group.isValid) this.group.checkValidity();

    if (notifyObservers) {
      this.notifyObserversOfChange();
    }
  };

  return ValidationResultProperty;
})();

exports.ValidationResultProperty = ValidationResultProperty;