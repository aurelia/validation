define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var data = {
    settings: {
      numericRegex: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
    },
    messages: {
      isRequired: "est obligatoire",
      AlphaNumericOrWhitespaceValidationRule: function (newValue, threshold) {
        return "ne peut contenir que des caractères alphanumériques ou des espaces";
      },
      AlphaNumericValidationRule: function (newValue, threshold) {
        return "ne peut contenir que des caractères alphanumériques";
      },
      BetweenLengthValidationRule: function (newValue, threshold) {
        return "doit contenir de " + threshold.minimumLength + " à " + threshold.maximumLength + " caractères";
      },
      BetweenValueValidationRule: function (newValue, threshold) {
        return "doit être entre " + threshold.minimumValue + " et " + threshold.maximumValue;
      },
      CustomFunctionValidationRule: function (newValue, threshold) {
        return "n'est pas une valeur valide";
      },
      DigitValidationRule: function (newValue, threshold) {
        return "doit contenir uniquement des caractères numériques";
      },
      EmailValidationRule: function (newValue, threshold) {
        return "n'est pas une adresse email valide";
      },
      EqualityValidationRule: function (newValue, threshold) {
        if (threshold.otherValueLabel) if (threshold.equality) return "doit correspondre à " + threshold.otherValueLabel;else return "ne doit pas correspondre à " + threshold.otherValueLabel;else if (threshold.equality) return "doit être " + threshold.otherValue;else return "ne doit pas être " + threshold.otherValue;
      },
      InCollectionValidationRule: function (newValue, threshold) {
        return "n'est pas une valeur valide";
      },
      MinimumLengthValidationRule: function (newValue, threshold) {
        return "doit contenir au moins " + threshold + " caractères";
      },
      MinimumValueValidationRule: function (newValue, threshold) {
        return "doit être " + threshold + " ou plus";
      },
      MaximumLengthValidationRule: function (newValue, threshold) {
        return "ne doit pas contenir plus de " + threshold + " caractères";
      },
      MaximumValueValidationRule: function (newValue, threshold) {
        return "doit être moins que " + threshold;
      },
      NumericValidationRule: function (newValue, threshold) {
        return "doit être une valeur numérique";
      },
      RegexValidationRule: function (newValue, threshold) {
        return "n'est pas une valeur valide";
      },
      StrongPasswordValidationRule: function (newValue, threshold) {
        if (threshold == 4) return "doit contenir une combinaison de lettres minuscules, de lettres majuscules, de caractères numériques et de caractères spéciaux";else return "doit contenir au moins " + threshold + " des caractéristiques suivantes : lettres minuscules, lettres majuscules, caractères numériques ou caractères spéciaux";
      }
    }
  };
  exports.data = data;
});