'use strict';

System.register(['aurelia-metadata'], function (_export, _context) {
  var metadata, _class, _temp, ValidationMetadata, ValidationPropertyMetadata;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaMetadata) {
      metadata = _aureliaMetadata.metadata;
    }],
    execute: function () {
      _export('ValidationMetadata', ValidationMetadata = (_temp = _class = function () {
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
      }(), _class.metadataKey = 'aurelia:validation', _temp));

      _export('ValidationMetadata', ValidationMetadata);

      ValidationPropertyMetadata = function () {
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
        console.warn('The ensure decorator has been deprecated and will be removed in the next release.');
        return function (target, propertyName) {
          var validationMetadata = metadata.getOrCreateOwn(ValidationMetadata.metadataKey, ValidationMetadata, target);
          var property = validationMetadata.getOrCreateProperty(propertyName);
          property.addSetupStep(setupStep);
        };
      }

      _export('ensure', ensure);
    }
  };
});