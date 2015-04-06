System.register(["aurelia-binding", "../validation/validation-rules", "../validation/validation-rules-collection", "../validation/validation-group", "../validation/validation-locale-repository"], function (_export) {
  var ObserverLocator, AllRules, AllCollections, ValidationGroup, ValidationLocaleRepository, _createClass, _classCallCheck, Validation;

  return {
    setters: [function (_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
    }, function (_validationValidationRules) {
      AllRules = _validationValidationRules;
    }, function (_validationValidationRulesCollection) {
      AllCollections = _validationValidationRulesCollection;
    }, function (_validationValidationGroup) {
      ValidationGroup = _validationValidationGroup.ValidationGroup;
    }, function (_validationValidationLocaleRepository) {
      ValidationLocaleRepository = _validationValidationLocaleRepository.ValidationLocaleRepository;
    }],
    execute: function () {
      "use strict";

      _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

      _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

      /**
       * A lightweight validation plugin
       * @class Validation
       * @constructor
       */
      Validation = _export("Validation", (function () {

        /**
         * Instantiates a new {Validation}
         * @param observerLocator the observerLocator used to observer properties
         */

        function Validation(observerLocator) {
          _classCallCheck(this, Validation);

          this.observerLocator = observerLocator;
        }

        _createClass(Validation, {
          on: {

            /**
             * Returns a new validation group on the subject
             * @param subject The subject to validate
             * @returns {ValidationGroup} A ValidationGroup that encapsulates the validation rules and current validation state for this subject
             */

            value: function on(subject) {
              return new ValidationGroup(subject, this.observerLocator);
            }
          }
        }, {
          inject: {
            value: function inject() {
              return [ObserverLocator];
            }
          }
        });

        return Validation;
      })());

      Validation.Utilities = {
        isEmptyValue: function isEmptyValue(val) {
          if (typeof val === "function") {
            return this.isEmptyValue(val());
          }
          if (val === undefined) {
            return true;
          }
          if (val === null) {
            return true;
          }
          if (val === "") {
            return true;
          }
          if (typeof val === "string") {
            if (String.prototype.trim) {
              val = val.trim();
            } else {
              val = val.replace(/^\s+|\s+$/g, "");
            }
          }

          if (val.length !== undefined) {
            return 0 === val.length;
          }
          return false;
        }
      };
      Validation.Locale = new ValidationLocaleRepository();

      Validation.debounceTime = 150;
    }
  };
});