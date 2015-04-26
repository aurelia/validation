'use strict';

var _interopRequireWildcard = function (obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (typeof obj === 'object' && obj !== null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ObserverLocator = require('aurelia-binding');

var _import = require('../validation/validation-rules');

var AllRules = _interopRequireWildcard(_import);

var _import2 = require('../validation/validation-rules-collection');

var AllCollections = _interopRequireWildcard(_import2);

var _ValidationGroup = require('../validation/validation-group');

var _inject = require('aurelia-dependency-injection');

var _ValidationConfig = require('../validation/validation-config');

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
      var conf = new _ValidationConfig.ValidationConfig(this.config);
      if (configCallback !== null && configCallback !== undefined && typeof configCallback === 'function') {
        configCallback(conf);
      }
      return new _ValidationGroup.ValidationGroup(subject, this.observerLocator, conf);
    }
  }]);

  Validation = _inject.inject(_ObserverLocator.ObserverLocator)(Validation) || Validation;
  return Validation;
})();

exports.Validation = Validation;

Validation.defaults = new _ValidationConfig.ValidationConfig();