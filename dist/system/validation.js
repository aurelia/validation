'use strict';

System.register(['aurelia-binding', './validation-group', 'aurelia-dependency-injection', './validation-config'], function (_export, _context) {
  var ObserverLocator, ValidationGroup, inject, ValidationConfig, _dec, _class, Validation;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
    }, function (_validationGroup) {
      ValidationGroup = _validationGroup.ValidationGroup;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_validationConfig) {
      ValidationConfig = _validationConfig.ValidationConfig;
    }],
    execute: function () {
      _export('Validation', Validation = (_dec = inject(ObserverLocator), _dec(_class = function () {
        function Validation(observerLocator, validationConfig) {
          _classCallCheck(this, Validation);

          this.observerLocator = observerLocator;
          this.config = validationConfig ? validationConfig : Validation.defaults;
        }

        Validation.prototype.on = function on(subject, configCallback) {
          var conf = new ValidationConfig(this.config);
          if (configCallback !== null && configCallback !== undefined && typeof configCallback === 'function') {
            configCallback(conf);
          }
          return new ValidationGroup(subject, this.observerLocator, conf);
        };

        Validation.prototype.onBreezeEntity = function onBreezeEntity(breezeEntity, configCallback) {
          var validation = this.on(breezeEntity, configCallback);
          validation.onBreezeEntity();
          return validation;
        };

        return Validation;
      }()) || _class));

      _export('Validation', Validation);

      Validation.defaults = new ValidationConfig();
    }
  };
});