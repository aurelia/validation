define(["exports", "../resources/defaults"], function (exports, _resourcesDefaults) {
  "use strict";

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var key in props) {
        var prop = props[key];
        prop.configurable = true;
        if (prop.value) prop.writable = true;
      }
      Object.defineProperties(target, props);
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var _classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var ValidationLocaleDefaults = _resourcesDefaults.ValidationLocaleDefaults;

  var ValidationLocaleRepository = exports.ValidationLocaleRepository = (function () {
    function ValidationLocaleRepository() {
      _classCallCheck(this, ValidationLocaleRepository);

      this.defaults = new ValidationLocaleDefaults();
      this.currentLocale = null;
      this.currentLocaleIdentifier = null;
    }

    _createClass(ValidationLocaleRepository, {
      reset: {
        value: function reset() {
          this.currentLocaleIdentifier = null;
          this.currentLocale = null;
        }
      },
      load: {
        value: function load(lang) {
          var self = this;
          return new Promise(function (resolve, reject) {
            if (self.currentLocaleIdentifier === lang && self.currentLocale !== null) {
              resolve(true);
              return;
            }
            self.currentLocaleIdentifier = lang;
            System["import"]("./src/resources/" + self.currentLocaleIdentifier).then(function (resource) {
              self.currentLocale = resource.data;
              resolve(true);
            });
          });
        }
      },
      getValueFor: {
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
          throw "Could not find validation : " + identifier + " in category: " + category;
        }
      },
      setting: {
        value: function setting(settingIdentifier) {
          return this.getValueFor(settingIdentifier, "settings");
        }
      },
      translate: {
        value: function translate(translationIdentifier, newValue, threshold) {
          var translation = this.getValueFor(translationIdentifier, "messages");
          if (typeof translation === "function") {
            return translation(newValue, threshold);
          }
          if (typeof translation === "string") {
            return translation;
          }
          throw "Validation message for " + translationIdentifier + "was in an unsupported format";
        }
      }
    });

    return ValidationLocaleRepository;
  })();
});
