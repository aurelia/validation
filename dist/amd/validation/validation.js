define(['exports', 'aurelia-binding', '../validation/validation-rules', '../validation/validation-rules-collection', '../validation/validation-group', '../validation/validation-locale-repository'], function (exports, _aureliaBinding, _validationValidationRules, _validationValidationRulesCollection, _validationValidationGroup, _validationValidationLocaleRepository) {
  'use strict';

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var Validation = (function () {
    function Validation(observerLocator) {
      _classCallCheck(this, _Validation);

      this.observerLocator = observerLocator;
    }

    _createClass(Validation, [{
      key: 'on',
      value: function on(subject) {
        return new _validationValidationGroup.ValidationGroup(subject, this.observerLocator);
      }
    }]);

    var _Validation = Validation;
    Validation = inject(_aureliaBinding.ObserverLocator)(Validation) || Validation;
    return Validation;
  })();

  exports.Validation = Validation;

  Validation.Utilities = {
    isEmptyValue: function isEmptyValue(val) {
      if (typeof val === 'function') {
        return this.isEmptyValue(val());
      }
      if (val === undefined) {
        return true;
      }
      if (val === null) {
        return true;
      }
      if (val === '') {
        return true;
      }
      if (typeof val === 'string') {
        if (String.prototype.trim) {
          val = val.trim();
        } else {
          val = val.replace(/^\s+|\s+$/g, '');
        }
      }

      if (val.length !== undefined) {
        return 0 === val.length;
      }
      return false;
    }
  };
  Validation.Locale = new _validationValidationLocaleRepository.ValidationLocaleRepository();

  Validation.debounceTime = 150;
});