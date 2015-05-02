"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

exports.__esModule = true;
exports.ensure = ensure;

var ValidationMetadata = (function () {
  function ValidationMetadata() {
    _classCallCheck(this, ValidationMetadata);

    this.properties = [];
  }

  ValidationMetadata.prototype.getOrCreateProperty = function getOrCreateProperty(propertyName) {
    var property = this.properties.find(function (x) {
      return x.propertyName === propertyName;
    });
    if (property === undefined) {
      property = new ValidationPropertyMetadata(propertyName);
      this.properties.push(property);
    }
    return property;
  };

  ValidationMetadata.prototype.setup = function setup(validation) {
    this.properties.forEach(function (property) {
      property.setup(validation);
    });
  };

  return ValidationMetadata;
})();

var ValidationPropertyMetadata = (function () {
  function ValidationPropertyMetadata(propertyName) {
    _classCallCheck(this, ValidationPropertyMetadata);

    this.propertyName = propertyName;
    this.setupSteps = [];
  }

  ValidationPropertyMetadata.prototype.addSetupStep = function addSetupStep(setupStep) {
    this.setupSteps.push(setupStep);
  };

  ValidationPropertyMetadata.prototype.setup = function setup(validation) {
    validation.ensure(this.propertyName);
    this.setupSteps.forEach(function (setupStep) {
      setupStep(validation);
    });
  };

  return ValidationPropertyMetadata;
})();

function ensure(setupStep) {
  return function (target, propertyName) {
    if (target._validationMetadata === undefined) {
      target._validationMetadata = new ValidationMetadata();
    }
    var property = target._validationMetadata.getOrCreateProperty(propertyName);
    property.addSetupStep(setupStep);
  };
}