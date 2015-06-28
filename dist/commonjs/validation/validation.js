'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaBinding = require('aurelia-binding');

var _validationValidationRules = require('../validation/validation-rules');

var AllRules = _interopRequireWildcard(_validationValidationRules);

var _validationValidationRulesCollection = require('../validation/validation-rules-collection');

var AllCollections = _interopRequireWildcard(_validationValidationRulesCollection);

var _validationValidationGroup = require('../validation/validation-group');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _validationValidationConfig = require('../validation/validation-config');

var Validation = (function () {
  function Validation(observerLocator, validationConfig) {
    _classCallCheck(this, _Validation);

    this.observerLocator = observerLocator;
    this.config = validationConfig ? validationConfig : Validation.defaults;
  }

  var _Validation = Validation;

  _Validation.prototype.on = function on(subject, configCallback) {
    var conf = new _validationValidationConfig.ValidationConfig(this.config);
    if (configCallback !== null && configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(conf);
    }
    return new _validationValidationGroup.ValidationGroup(subject, this.observerLocator, conf);
  };

  _Validation.prototype.onBreezeEntity = function onBreezeEntity(breezeEntity, configCallback) {
    var validation = this.on(breezeEntity, configCallback);
    validation.onBreezeEntity();
    return validation;
  };

  Validation = _aureliaDependencyInjection.inject(_aureliaBinding.ObserverLocator)(Validation) || Validation;
  return Validation;
})();

exports.Validation = Validation;

Validation.defaults = new _validationValidationConfig.ValidationConfig();