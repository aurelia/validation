'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validation = undefined;

var _dec, _class;

var _aureliaBinding = require('aurelia-binding');

var _validationGroup = require('./validation-group');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _validationConfig = require('./validation-config');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Validation = exports.Validation = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaBinding.ObserverLocator), _dec(_class = function () {
  function Validation(observerLocator, validationConfig) {
    _classCallCheck(this, Validation);

    this.observerLocator = observerLocator;
    this.config = validationConfig ? validationConfig : Validation.defaults;
  }

  Validation.prototype.on = function on(subject, configCallback) {
    var conf = new _validationConfig.ValidationConfig(this.config);
    if (configCallback !== null && configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(conf);
    }
    return new _validationGroup.ValidationGroup(subject, this.observerLocator, conf);
  };

  Validation.prototype.onBreezeEntity = function onBreezeEntity(breezeEntity, configCallback) {
    var validation = this.on(breezeEntity, configCallback);
    validation.onBreezeEntity();
    return validation;
  };

  return Validation;
}()) || _class);

Validation.defaults = new _validationConfig.ValidationConfig();