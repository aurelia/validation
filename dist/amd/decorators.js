define(['exports', 'aurelia-metadata'], function (exports, _aureliaMetadata) {
  'use strict';

  exports.__esModule = true;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.ensure = ensure;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

    _createClass(ValidationMetadata, null, [{
      key: 'metadataKey',
      value: 'aurelia:validation',
      enumerable: true
    }]);

    return ValidationMetadata;
  })();

  exports.ValidationMetadata = ValidationMetadata;

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
      var validationMetadata = _aureliaMetadata.metadata.getOrCreateOwn(ValidationMetadata.metadataKey, ValidationMetadata, target);
      var property = validationMetadata.getOrCreateProperty(propertyName);
      property.addSetupStep(setupStep);
    };
  }
});