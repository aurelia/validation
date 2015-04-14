'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var ValidationLocale = (function () {
  function ValidationLocale(defaults, data) {
    _classCallCheck(this, ValidationLocale);

    this.defaults = defaults;
    this.currentLocale = data;
  }

  _createClass(ValidationLocale, [{
    key: 'getValueFor',
    value: function getValueFor(identifier, category) {
      if (this.currentLocale && this.currentLocale[category]) {
        var currentLocaleSetting = this.currentLocale[category][identifier];
        if (currentLocaleSetting !== undefined && currentLocaleSetting !== null) {
          return currentLocaleSetting;
        }
      }
      if (this.defaults[category]) {
        var defaultSetting = this.defaults[category][identifier];
        if (defaultSetting !== undefined && defaultSetting !== null) {
          return defaultSetting;
        }
      }
      throw 'validation: I18N: Could not find: ' + identifier + ' in category: ' + category;
    }
  }, {
    key: 'setting',
    value: function setting(settingIdentifier) {
      return this.getValueFor(settingIdentifier, 'settings');
    }
  }, {
    key: 'translate',
    value: function translate(translationIdentifier, newValue, threshold) {
      var translation = this.getValueFor(translationIdentifier, 'messages');
      if (typeof translation === 'function') {
        return translation(newValue, threshold);
      }
      if (typeof translation === 'string') {
        return translation;
      }
      throw 'Validation message for ' + translationIdentifier + 'was in an unsupported format';
    }
  }]);

  return ValidationLocale;
})();

exports.ValidationLocale = ValidationLocale;

var ValidationLocaleRepository = (function () {
  function ValidationLocaleRepository() {
    _classCallCheck(this, ValidationLocaleRepository);

    this['default'] = null;
    this.instances = new Map();
    this.defaults = {
      settings: {
        numericRegex: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
      },
      messages: {}
    };
  }

  _createClass(ValidationLocaleRepository, [{
    key: 'load',
    value: function load(localeIdentifier, basePath) {
      var _this = this;

      if (!basePath) basePath = 'aurelia-validation/resources/';
      return new Promise(function (resolve, reject) {
        if (_this.instances.has(localeIdentifier)) {
          var locale = _this.instances.get(localeIdentifier);
          resolve(locale);
        } else {
          System['import'](basePath + localeIdentifier).then(function (resource) {
            var locale = _this.addLocale(localeIdentifier, resource.data);
            resolve(locale);
          });
        }
      });
    }
  }, {
    key: 'addLocale',
    value: function addLocale(localeIdentifier, data) {
      var instance = new ValidationLocale(this.defaults, data);
      this.instances.set(localeIdentifier, instance);
      if (this['default'] === null) this['default'] = instance;
      return instance;
    }
  }]);

  return ValidationLocaleRepository;
})();

ValidationLocale.Repository = new ValidationLocaleRepository();