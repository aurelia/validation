'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationMetadata = undefined;

var _class, _temp;

exports.ensure = ensure;

var _aureliaMetadata = require('aurelia-metadata');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationMetadata = exports.ValidationMetadata = (_temp = _class = function () {
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
}(), _class.metadataKey = 'aurelia:validation', _temp);

var ValidationPropertyMetadata = function () {
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
}();

function ensure(setupStep) {
  return function (target, propertyName) {
    var validationMetadata = _aureliaMetadata.metadata.getOrCreateOwn(ValidationMetadata.metadataKey, ValidationMetadata, target);
    var property = validationMetadata.getOrCreateProperty(propertyName);
    property.addSetupStep(setupStep);
  };
}