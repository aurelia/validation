System.register(['../validation/validation-rules-collection', '../validation/path-observer', '../validation/debouncer'], function (_export) {
  var AllCollections, PathObserver, Debouncer, _classCallCheck, _createClass, ValidationProperty;

  return {
    setters: [function (_validationValidationRulesCollection) {
      AllCollections = _validationValidationRulesCollection;
    }, function (_validationPathObserver) {
      PathObserver = _validationPathObserver.PathObserver;
    }, function (_validationDebouncer) {
      Debouncer = _validationDebouncer.Debouncer;
    }],
    execute: function () {
      'use strict';

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      ValidationProperty = (function () {
        function ValidationProperty(observerLocator, propertyName, validationGroup, propertyResult) {
          var _this = this;

          _classCallCheck(this, ValidationProperty);

          this.propertyResult = propertyResult;
          this.propertyName = propertyName;
          this.validationGroup = validationGroup;
          this.validationRules = new AllCollections.ValidationRulesCollection();

          this.observer = new PathObserver(observerLocator, validationGroup.subject, propertyName).getObserver();

          var debouncer = new Debouncer();

          this.observer.subscribe(function () {
            debouncer.debounce(function () {
              _this.validateCurrentValue(true);
            });
          });
        }

        _createClass(ValidationProperty, [{
          key: 'addValidationRule',
          value: function addValidationRule(validationRule) {
            if (validationRule.validate === undefined) throw new exception('That\'s not a valid validationRule');
            this.validationRules.addValidationRule(validationRule);
            this.validateCurrentValue(false);
          }
        }, {
          key: 'validateCurrentValue',
          value: function validateCurrentValue(forceDirty) {
            return this.validate(this.observer.getValue(), forceDirty);
          }
        }, {
          key: 'validate',
          value: function validate(newValue, shouldBeDirty) {
            var _this2 = this;

            return this.validationRules.validate(newValue).then(function (validationResponse) {
              _this2.propertyResult.setValidity(validationResponse, shouldBeDirty);
              return Promise.resolve(true);
            }, function (validationResponse) {
              _this2.propertyResult.setValidity(validationResponse, shouldBeDirty);
              return Promise.reject(false);
            });
          }
        }]);

        return ValidationProperty;
      })();

      _export('ValidationProperty', ValidationProperty);
    }
  };
});