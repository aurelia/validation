System.register(['aurelia-binding', '../validation/validation-rules', '../validation/validation-rules-collection', '../validation/validation-group', 'aurelia-dependency-injection', '../validation/validation-config'], function (_export) {
  var ObserverLocator, AllRules, AllCollections, ValidationGroup, inject, ValidationConfig, _classCallCheck, _createClass, Validation;

  return {
    setters: [function (_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
    }, function (_validationValidationRules) {
      AllRules = _validationValidationRules;
    }, function (_validationValidationRulesCollection) {
      AllCollections = _validationValidationRulesCollection;
    }, function (_validationValidationGroup) {
      ValidationGroup = _validationValidationGroup.ValidationGroup;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_validationValidationConfig) {
      ValidationConfig = _validationValidationConfig.ValidationConfig;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      Validation = (function () {
        function Validation(observerLocator, validationConfig) {
          _classCallCheck(this, _Validation);

          this.observerLocator = observerLocator;
          this.config = validationConfig ? validationConfig : Validation.defaults;
        }

        _createClass(Validation, [{
          key: 'on',
          value: function on(subject, configCallback) {
            var conf = new ValidationConfig(this.config);
            if (configCallback !== null && configCallback !== undefined && typeof configCallback === 'function') {
              configCallback(conf);
            }
            return new ValidationGroup(subject, this.observerLocator, conf);
          }
        }, {
          key: 'onBreezeEntity',
          value: function onBreezeEntity(breezeEntity, configCallback) {
            var validation = this.on(breezeEntity, configCallback);
            validation.onBreezeEntity();
            return validation;
          }
        }]);

        var _Validation = Validation;
        Validation = inject(ObserverLocator)(Validation) || Validation;
        return Validation;
      })();

      _export('Validation', Validation);

      Validation.defaults = new ValidationConfig();
    }
  };
});