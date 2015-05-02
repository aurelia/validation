'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _import = require('../validation/validation-rules-collection');

var AllCollections = _interopRequireWildcard(_import);

var _PathObserver = require('../validation/path-observer');

var _Debouncer = require('../validation/debouncer');

var ValidationProperty = (function () {
  function ValidationProperty(observerLocator, propertyName, validationGroup, propertyResult, config) {
    var _this = this;

    _classCallCheck(this, ValidationProperty);

    this.propertyResult = propertyResult;
    this.propertyName = propertyName;
    this.validationGroup = validationGroup;
    this.collectionOfValidationRules = new AllCollections.ValidationRulesCollection();
    this.config = config;
    this.latestValue = undefined;

    this.observer = new _PathObserver.PathObserver(observerLocator, validationGroup.subject, propertyName).getObserver();

    this.debouncer = new _Debouncer.Debouncer(config.getDebounceTimeout());

    this.observer.subscribe(function () {
      _this.debouncer.debounce(function () {
        var newValue = _this.observer.getValue();
        if (newValue !== _this.latestValue) {
          _this.validate(newValue, true);
        }
      });
    });

    this.dependencyObservers = [];
    var dependencies = this.config.getDependencies();
    for (var i = 0; i < dependencies.length; i++) {
      var dependencyObserver = new _PathObserver.PathObserver(observerLocator, validationGroup.subject, dependencies[i]).getObserver();
      dependencyObserver.subscribe(function () {
        _this.debouncer.debounce(function () {
          _this.validateCurrentValue(true);
        });
      });
      this.dependencyObservers.push(dependencyObserver);
    }
  }

  ValidationProperty.prototype.addValidationRule = function addValidationRule(validationRule) {
    if (validationRule.validate === undefined) throw new exception('That\'s not a valid validationRule');
    this.collectionOfValidationRules.addValidationRule(validationRule);
    this.validateCurrentValue(false);
  };

  ValidationProperty.prototype.validateCurrentValue = function validateCurrentValue(forceDirty, forceExecution) {
    return this.validate(this.observer.getValue(), forceDirty, forceExecution);
  };

  ValidationProperty.prototype.clear = function clear() {
    this.latestValue = this.observer.getValue();
    this.propertyResult.clear();
  };

  ValidationProperty.prototype.validate = function validate(newValue, shouldBeDirty, forceExecution) {
    var _this2 = this;

    if (!this.propertyResult.isDirty && shouldBeDirty || this.latestValue !== newValue || forceExecution) {
      this.latestValue = newValue;
      return this.config.locale().then(function (locale) {
        return _this2.collectionOfValidationRules.validate(newValue, locale).then(function (validationResponse) {
          if (_this2.latestValue === validationResponse.latestValue) _this2.propertyResult.setValidity(validationResponse, shouldBeDirty);
          return validationResponse.isValid;
        })['catch'](function (err) {
          console.log('Unexpected behavior: a validation-rules-collection should always fulfil', err);
          debugger;
          throw Error('Unexpected behavior: a validation-rules-collection should always fulfil');
        });
      }, function () {
        throw Error('An exception occurred while trying to load the locale');
      });
    }
  };

  return ValidationProperty;
})();

exports.ValidationProperty = ValidationProperty;