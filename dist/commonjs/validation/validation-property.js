'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('../validation/validation-rules-collection');

var AllCollections = _interopRequireWildcard(_import);

var _PathObserver = require('../validation/path-observer');

var _Debouncer = require('../validation/debouncer');

var ValidationProperty = (function () {
  function ValidationProperty(observerLocator, propertyName, validationGroup, propertyResult) {
    var _this = this;

    _classCallCheck(this, ValidationProperty);

    this.propertyResult = propertyResult;
    this.propertyName = propertyName;
    this.validationGroup = validationGroup;
    this.validationRules = new AllCollections.ValidationRulesCollection();

    this.observer = new _PathObserver.PathObserver(observerLocator, validationGroup.subject, propertyName).getObserver();

    var debouncer = new _Debouncer.Debouncer();

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

exports.ValidationProperty = ValidationProperty;