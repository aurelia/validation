System.register([], function (_export) {
  'use strict';

  var ValidationLocale, ValidationLocaleRepository;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [],
    execute: function () {
      ValidationLocale = (function () {
        function ValidationLocale(defaults, data) {
          _classCallCheck(this, ValidationLocale);

          this.defaults = defaults;
          this.currentLocale = data;
        }

        ValidationLocale.prototype.getValueFor = function getValueFor(identifier, category) {
          var currentLocaleSetting = undefined;
          var defaultSetting = undefined;
          if (this.currentLocale && this.currentLocale[category]) {
            currentLocaleSetting = this.currentLocale[category][identifier];
            if (currentLocaleSetting !== undefined && currentLocaleSetting !== null) {
              return currentLocaleSetting;
            }
          }
          if (this.defaults[category]) {
            defaultSetting = this.defaults[category][identifier];
            if (defaultSetting !== undefined && defaultSetting !== null) {
              return defaultSetting;
            }
          }
          throw new Error('validation: I18N: Could not find: ' + identifier + ' in category: ' + category);
        };

        ValidationLocale.prototype.setting = function setting(settingIdentifier) {
          return this.getValueFor(settingIdentifier, 'settings');
        };

        ValidationLocale.prototype.translate = function translate(translationIdentifier, newValue, threshold) {
          var translation = this.getValueFor(translationIdentifier, 'messages');
          if (typeof translation === 'function') {
            return translation(newValue, threshold);
          }
          if (typeof translation === 'string') {
            return translation;
          }
          throw new Error('Validation message for ' + translationIdentifier + 'was in an unsupported format');
        };

        return ValidationLocale;
      })();

      _export('ValidationLocale', ValidationLocale);

      ValidationLocaleRepository = (function () {
        function ValidationLocaleRepository() {
          _classCallCheck(this, ValidationLocaleRepository);

          this['default'] = null;
          this.instances = new Map();
          this.defaults = {
            settings: {
              'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
            },
            messages: {}
          };
        }

        ValidationLocaleRepository.prototype.load = function load(localeIdentifier, basePath) {
          var _this = this;

          var that = this;
          if (!basePath) {
            basePath = 'aurelia-validation/resources/';
          }
          return new Promise(function (resolve, reject) {
            if (_this.instances.has(localeIdentifier)) {
              var locale = _this.instances.get(localeIdentifier);
              resolve(locale);
            } else {
              if (window.require) {
                require([basePath + localeIdentifier], function (resource) {
                  var locale = that.addLocale(localeIdentifier, resource.data);
                  resolve(locale);
                });
              } else {
                System['import'](basePath + localeIdentifier).then(function (resource) {
                  var locale = that.addLocale(localeIdentifier, resource.data);
                  resolve(locale);
                });
              }
            }
          });
        };

        ValidationLocaleRepository.prototype.addLocale = function addLocale(localeIdentifier, data) {
          var instance = new ValidationLocale(this.defaults, data);
          this.instances.set(localeIdentifier, instance);
          if (this['default'] === null) {
            this['default'] = instance;
          }
          return instance;
        };

        return ValidationLocaleRepository;
      })();

      ValidationLocale.Repository = new ValidationLocaleRepository();
    }
  };
});