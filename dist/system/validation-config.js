'use strict';

System.register(['./validation-locale', './strategies/twbootstrap-view-strategy'], function (_export, _context) {
  var ValidationLocale, TWBootstrapViewStrategy, ValidationConfigDefaults, ValidationConfig;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_validationLocale) {
      ValidationLocale = _validationLocale.ValidationLocale;
    }, function (_strategiesTwbootstrapViewStrategy) {
      TWBootstrapViewStrategy = _strategiesTwbootstrapViewStrategy.TWBootstrapViewStrategy;
    }],
    execute: function () {
      _export('ValidationConfigDefaults', ValidationConfigDefaults = function ValidationConfigDefaults() {
        _classCallCheck(this, ValidationConfigDefaults);
      });

      _export('ValidationConfigDefaults', ValidationConfigDefaults);

      ValidationConfigDefaults._defaults = {
        debounceTimeout: 0,
        dependencies: [],
        locale: 'en-US',
        localeResources: 'aurelia-validation/resources/',
        viewStrategy: TWBootstrapViewStrategy.AppendToMessage,
        allPropertiesAreMandatory: false
      };
      ValidationConfigDefaults.defaults = function () {
        var defaults = {};
        Object.assign(defaults, ValidationConfigDefaults._defaults);
        return defaults;
      };

      _export('ValidationConfig', ValidationConfig = function () {
        function ValidationConfig(innerConfig) {
          _classCallCheck(this, ValidationConfig);

          this.innerConfig = innerConfig;
          this.values = this.innerConfig ? {} : ValidationConfigDefaults.defaults();
          this.changedHandlers = new Map();
        }

        ValidationConfig.prototype.getValue = function getValue(identifier) {
          if (this.values.hasOwnProperty(identifier) !== null && this.values[identifier] !== undefined) {
            return this.values[identifier];
          }
          if (this.innerConfig !== null) {
            return this.innerConfig.getValue(identifier);
          }
          throw Error('Config not found: ' + identifier);
        };

        ValidationConfig.prototype.setValue = function setValue(identifier, value) {
          this.values[identifier] = value;
          return this;
        };

        ValidationConfig.prototype.onLocaleChanged = function onLocaleChanged(callback) {
          var _this = this;

          if (this.innerConfig !== undefined) {
            return this.innerConfig.onLocaleChanged(callback);
          }
          var id = ++ValidationConfig.uniqueListenerId;
          this.changedHandlers.set(id, callback);
          return function () {
            _this.changedHandlers.delete(id);
          };
        };

        ValidationConfig.prototype.getDebounceTimeout = function getDebounceTimeout() {
          return this.getValue('debounceTimeout');
        };

        ValidationConfig.prototype.useDebounceTimeout = function useDebounceTimeout(value) {
          return this.setValue('debounceTimeout', value);
        };

        ValidationConfig.prototype.getDependencies = function getDependencies() {
          return this.getValue('dependencies');
        };

        ValidationConfig.prototype.computedFrom = function computedFrom(dependencies) {
          var deps = dependencies;
          if (typeof dependencies === 'string') {
            deps = [];
            deps.push(dependencies);
          }
          return this.setValue('dependencies', deps);
        };

        ValidationConfig.prototype.useLocale = function useLocale(localeIdentifier) {
          this.setValue('locale', localeIdentifier);
          var callbacks = Array.from(this.changedHandlers.values());
          for (var i = 0; i < callbacks.length; i++) {
            callbacks[i]();
          }
          return this;
        };

        ValidationConfig.prototype.locale = function locale() {
          return ValidationLocale.Repository.load(this.getValue('locale'), this.getValue('localeResources'));
        };

        ValidationConfig.prototype.useViewStrategy = function useViewStrategy(viewStrategy) {
          return this.setValue('viewStrategy', viewStrategy);
        };

        ValidationConfig.prototype.getViewStrategy = function getViewStrategy() {
          return this.getValue('viewStrategy');
        };

        ValidationConfig.prototype.treatAllPropertiesAsMandatory = function treatAllPropertiesAsMandatory() {
          this.setValue('allPropertiesAreMandatory', true);
          return this;
        };

        ValidationConfig.prototype.treatAllPropertiesAsOptional = function treatAllPropertiesAsOptional() {
          this.setValue('allPropertiesAreMandatory', false);
          return this;
        };

        return ValidationConfig;
      }());

      _export('ValidationConfig', ValidationConfig);

      ValidationConfig.uniqueListenerId = 0;
    }
  };
});