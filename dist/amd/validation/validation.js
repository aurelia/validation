define(["exports", "aurelia-binding", "../validation/validationRules", "../validation/validationRulesCollection", "../validation/validationGroup", "../validation/validationLocaleRepository"], function (exports, _aureliaBinding, _validationValidationRules, _validationValidationRulesCollection, _validationValidationGroup, _validationValidationLocaleRepository) {
    "use strict";

    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var ObserverLocator = _aureliaBinding.ObserverLocator;
    var AllRules = _validationValidationRules;
    var AllCollections = _validationValidationRulesCollection;
    var ValidationGroup = _validationValidationGroup.ValidationGroup;
    var ValidationLocaleRepository = _validationValidationLocaleRepository.ValidationLocaleRepository;

    var Validation = exports.Validation = (function () {
        function Validation(observerLocator) {
            _classCallCheck(this, Validation);

            this.observerLocator = observerLocator;
        }

        _createClass(Validation, {
            on: {
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
    })();

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
});