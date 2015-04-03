System.register([], function (_export) {
  var data;
  return {
    setters: [],
    execute: function () {
      "use strict";

      data = {
        settings: {
          numericRegex: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
        },
        messages: {
          isRequired: "est obligatoire",
          AlphaNumericOrWhitespaceValidationRule: function (newValue, threshold) {
            return "ne peut contenir que des caractères de type numérique ou alphabétique ou avec des espaces";
          },
          AlphaNumericValidationRule: function (newValue, threshold) {
            return "ne peut contenir que des caractères de type numérique ou alphabétique";
          },
          BetweenLengthValidationRule: function (newValue, threshold) {
            return "doit être compris entre between " + threshold.minimumLength + " et " + threshold.maximumLength + " caratères";
          },
          BetweenValueValidationRule: function (newValue, threshold) {
            return "doit être entre " + threshold.minimumValue + " et " + threshold.maximumValue;
          },
          CustomFunctionValidationRule: function (newValue, threshold) {
            return "n'est pas une valeur valide";
          },
          DigitValidationRule: function (newValue, threshold) {
            return "doit contenir uniquement des valeurs nurmérique";
          },
          EmailValidationRule: function (newValue, threshold) {
            return "n'est pas une email valide";
          },
          EqualityValidationRule: function (newValue, threshold) {
            if (threshold.otherValueLabel) if (threshold.equality) return "ne correspond pas " + threshold.otherValueLabel;else return "ne peut pas correspondre " + threshold.otherValueLabel;else if (threshold.equality) return "devrait être " + threshold.otherValue;else return "ne peut être " + threshold.otherValue;
          },
          InCollectionValidationRule: function (newValue, threshold) {
            return "n'est pas une valeur valide";
          },
          MinimumLengthValidationRule: function (newValue, threshold) {
            return "doit avoir au moins " + threshold + " caratères";
          },
          MinimumValueValidationRule: function (newValue, threshold) {
            return "doit être " + threshold + " ou plus";
          },
          MaximumLengthValidationRule: function (newValue, threshold) {
            return "ne peut être plus long que " + threshold + " caractères";
          },
          MaximumValueValidationRule: function (newValue, threshold) {
            return "doit être moins que " + threshold;
          },
          NumericValidationRule: function (newValue, threshold) {
            return "doit être numérique";
          },
          RegexValidationRule: function (newValue, threshold) {
            return "n'est pas une valeur valide";
          },
          StrongPasswordValidationRule: function (newValue, threshold) {
            if (threshold == 4) return "devrait contenir une combinaison de lettres en miniscule, majuscule, numérique et des caractères spéciaux";else return "devrait contenir au moins " + threshold + " les caractéristiques suivants: lettres minuscule, lettres majuscule, caractères numérique ou scpéciaux";
          }
        }
      };

      _export("data", data);
    }
  };
});