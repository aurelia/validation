define(['exports', 'aurelia-binding', '../validation/validation-rules', '../validation/validation-rules-collection', '../validation/validation-group', 'aurelia-dependency-injection', '../validation/validation-config'], function (exports, _aureliaBinding, _validationValidationRules, _validationValidationRulesCollection, _validationValidationGroup, _aureliaDependencyInjection, _validationValidationConfig) {
  'use strict';

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var Validation = (function () {
    function Validation(observerLocator, validationConfig) {
      _classCallCheck(this, _Validation);

      this.observerLocator = observerLocator;
      this.config = validationConfig ? validationConfig : Validation.defaults;
    }

    var _Validation = Validation;

    _createClass(_Validation, [{
      key: 'on',
      value: function on(subject, configCallback) {
        var conf = new _validationValidationConfig.ValidationConfig(this.config);
        if (configCallback !== null && configCallback !== undefined && typeof configCallback === 'function') {
          configCallback(conf);
        }
        return new _validationValidationGroup.ValidationGroup(subject, this.observerLocator, conf);
      }
    }]);

    Validation = _aureliaDependencyInjection.inject(_aureliaBinding.ObserverLocator)(Validation) || Validation;
    return Validation;
  })();

  exports.Validation = Validation;

  Validation.defaults = new _validationValidationConfig.ValidationConfig();
});