System.register(['../validation/validation-locale'], function (_export) {
  var ValidationLocale, _createClass, _classCallCheck, ValidationConfigDefaults, ValidationConfig;

  return {
    setters: [function (_validationValidationLocale) {
      ValidationLocale = _validationValidationLocale.ValidationLocale;
    }],
    execute: function () {
      'use strict';

      _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

      ValidationConfigDefaults = function ValidationConfigDefaults() {
        _classCallCheck(this, ValidationConfigDefaults);
      };

      ValidationConfigDefaults.defaults = function () {
        return {
          debounceTimeout: 0,
          dependencies: [],
          locale: 'en-US'
        };
      };

      ValidationConfig = (function () {
        function ValidationConfig(innerConfig) {
          _classCallCheck(this, ValidationConfig);

          this.innerConfig = innerConfig;
          this.values = this.innerConfig ? {} : ValidationConfigDefaults.defaults();
          this.changedHandlers = new Map();
        }

        _createClass(ValidationConfig, [{
          key: 'getValue',
          value: function getValue(identifier) {
            if (this.values.hasOwnProperty(identifier) !== null && this.values[identifier] !== undefined) {
              return this.values[identifier];
            }
            if (this.innerConfig !== null) {
              return this.innerConfig.getValue(identifier);
            }
            throw Error('Config not found: ' + identifier);
          }
        }, {
          key: 'setValue',
          value: function setValue(identifier, value) {
            this.values[identifier] = value;
            return this;
          }
        }, {
          key: 'onLocaleChanged',
          value: function onLocaleChanged(callback) {
            var _this = this;

            if (this.innerConfig !== undefined) {
              return this.innerConfig.onLocaleChanged(callback);
            } else {
              var _ret = (function () {
                var id = ++ValidationConfig.uniqueListenerId;
                _this.changedHandlers.set(id, callback);
                return {
                  v: function () {
                    changedHandlers['delete'](id);
                  }
                };
              })();

              if (typeof _ret === 'object') {
                return _ret.v;
              }
            }
          }
        }, {
          key: 'getDebounceTimeout',
          value: function getDebounceTimeout() {
            return this.getValue('debounceTimeout');
          }
        }, {
          key: 'useDebounceTimeout',
          value: function useDebounceTimeout(value) {
            return this.setValue('debounceTimeout', value);
          }
        }, {
          key: 'getDependencies',
          value: function getDependencies() {
            return this.getValue('dependencies');
          }
        }, {
          key: 'computedFrom',
          value: function computedFrom(dependencies) {
            var deps = dependencies;
            if (typeof dependencies === 'string') {
              deps = [];
              deps.push(dependencies);
            }
            return this.setValue('dependencies', deps);
          }
        }, {
          key: 'useLocale',
          value: function useLocale(localeIdentifier) {
            this.setValue('locale', localeIdentifier);
            var callbacks = Array.from(this.changedHandlers.values());
            for (var i = 0; i < callbacks.length; i++) {
              callbacks[i]();
            }
            return this;
          }
        }, {
          key: 'locale',
          value: function locale() {
            return ValidationLocale.Repository.load(this.getValue('locale'));
          }
        }]);

        return ValidationConfig;
      })();

      _export('ValidationConfig', ValidationConfig);

      ValidationConfig.uniqueListenerId = 0;
    }
  };
});