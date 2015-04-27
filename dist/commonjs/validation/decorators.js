"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensure = ensure;

var ValidationMetadata = (function () {
  function ValidationMetadata() {
    _classCallCheck(this, ValidationMetadata);

    this.properties = [];
  }

  _createClass(ValidationMetadata, [{
    key: "getOrCreateProperty",
    value: function getOrCreateProperty(propertyName) {
      var property = this.properties.find(function (x) {
        return x.propertyName === propertyName;
      });
      if (property === undefined) {
        property = new ValidationPropertyMetadata(propertyName);
        this.properties.push(property);
      }
      return property;
    }
  }, {
    key: "setup",
    value: function setup(validation) {
      this.properties.forEach(function (property) {
        property.setup(validation);
      });
    }
  }]);

  return ValidationMetadata;
})();

var ValidationPropertyMetadata = (function () {
  function ValidationPropertyMetadata(propertyName) {
    _classCallCheck(this, ValidationPropertyMetadata);

    this.propertyName = propertyName;
    this.setupSteps = [];
  }

  _createClass(ValidationPropertyMetadata, [{
    key: "addSetupStep",
    value: function addSetupStep(setupStep) {
      this.setupSteps.push(setupStep);
    }
  }, {
    key: "setup",
    value: function setup(validation) {
      validation.ensure(this.propertyName);
      this.setupSteps.forEach(function (setupStep) {
        setupStep(validation);
      });
    }
  }]);

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