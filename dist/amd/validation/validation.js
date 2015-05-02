define(['exports', 'aurelia-binding', '../validation/validation-rules', '../validation/validation-rules-collection', '../validation/validation-group', 'aurelia-dependency-injection', '../validation/validation-config'], function (exports, _aureliaBinding, _validationValidationRules, _validationValidationRulesCollection, _validationValidationGroup, _aureliaDependencyInjection, _validationValidationConfig) {
  'use strict';

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  exports.__esModule = true;

  var Validation = (function () {
    function Validation(observerLocator, validationConfig) {
      _classCallCheck(this, _Validation);

      this.observerLocator = observerLocator;
      this.config = validationConfig ? validationConfig : Validation.defaults;
    }

    Validation.prototype.on = function on(subject, configCallback) {
      var conf = new _validationValidationConfig.ValidationConfig(this.config);
      if (configCallback !== null && configCallback !== undefined && typeof configCallback === 'function') {
        configCallback(conf);
      }
      return new _validationValidationGroup.ValidationGroup(subject, this.observerLocator, conf);
    };

    Validation.prototype.onBreezeEntity = function onBreezeEntity(breezeEntity, configCallback) {
      var validation = this.on(breezeEntity, configCallback);
      validation.onBreezeEntity();
      return validation;
    };

    var _Validation = Validation;
    Validation = _aureliaDependencyInjection.inject(_aureliaBinding.ObserverLocator)(Validation) || Validation;
    return Validation;
  })();

  exports.Validation = Validation;

  Validation.defaults = new _validationValidationConfig.ValidationConfig();
});