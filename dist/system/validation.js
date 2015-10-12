System.register(['aurelia-binding', './validation-group', 'aurelia-dependency-injection', './validation-config'], function (_export) {
  'use strict';

  var ObserverLocator, ValidationGroup, inject, ValidationConfig, Validation;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
      Validation = (function () {
        function Validation(observerLocator, validationConfig) {
          _classCallCheck(this, _Validation);

          this.observerLocator = observerLocator;
          this.config = validationConfig ? validationConfig : Validation.defaults;
        }

        var _Validation = Validation;

        _Validation.prototype.on = function on(subject, configCallback) {
          var conf = new ValidationConfig(this.config);
          if (configCallback !== null && configCallback !== undefined && typeof configCallback === 'function') {
            configCallback(conf);
          }
          return new ValidationGroup(subject, this.observerLocator, conf);
        };

        _Validation.prototype.onBreezeEntity = function onBreezeEntity(breezeEntity, configCallback) {
          var validation = this.on(breezeEntity, configCallback);
          validation.onBreezeEntity();
          return validation;
        };

        Validation = inject(ObserverLocator)(Validation) || Validation;
        return Validation;
      })();

      _export('Validation', Validation);

      Validation.defaults = new ValidationConfig();
    }
  };
});