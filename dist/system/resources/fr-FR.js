System.register([], function (_export) {
  var data;
  return {
    setters: [],
    execute: function () {
      'use strict';

      data = {
        settings: {
          numericRegex: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
        },
        messages: {
          isRequired: 'est obligatoire',
          AlphaNumericOrWhitespaceValidationRule: function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
            return 'ne peut contenir que des caractères alphanumériques ou des espaces';
          },
          AlphaNumericValidationRule: function AlphaNumericValidationRule(newValue, threshold) {
            return 'ne peut contenir que des caractères alphanumériques';
          },
          AlphaValidationRule: function AlphaValidationRule(newValue, threshold) {
            return 'ne peut contenir que des lettres';
          },
          AlphaOrWhitespaceValidationRule: function AlphaOrWhitespaceValidationRule(newValue, threshold) {
            return 'ne peut contenir que des lettres ou des espaces';
          },
          BetweenLengthValidationRule: function BetweenLengthValidationRule(newValue, threshold) {
            return 'doit contenir de ' + threshold.minimumLength + ' à ' + threshold.maximumLength + ' caractères';
          },
          BetweenValueValidationRule: function BetweenValueValidationRule(newValue, threshold) {
            return 'doit être entre ' + threshold.minimumValue + ' et ' + threshold.maximumValue;
          },
          CustomFunctionValidationRule: function CustomFunctionValidationRule(newValue, threshold) {
            return 'n\'est pas une valeur valide';
          },
          DigitValidationRule: function DigitValidationRule(newValue, threshold) {
            return 'doit contenir uniquement des caractères numériques';
          },
          EmailValidationRule: function EmailValidationRule(newValue, threshold) {
            return 'n\'est pas une adresse email valide';
          },
          EqualityValidationRule: function EqualityValidationRule(newValue, threshold) {
            if (threshold.otherValueLabel) if (threshold.equality) {
              return 'doit correspondre à ' + threshold.otherValueLabel;
            } else {
              return 'ne doit pas correspondre à ' + threshold.otherValueLabel;
            } else if (threshold.equality) {
              return 'doit être ' + threshold.otherValue;
            } else {
              return 'ne doit pas être ' + threshold.otherValue;
            }
          },
          InCollectionValidationRule: function InCollectionValidationRule(newValue, threshold) {
            return 'n\'est pas une valeur valide';
          },
          MinimumLengthValidationRule: function MinimumLengthValidationRule(newValue, threshold) {
            return 'doit contenir au moins ' + threshold + ' caractères';
          },
          MinimumValueValidationRule: function MinimumValueValidationRule(newValue, threshold) {
            return 'doit être ' + threshold + ' ou plus';
          },
          MaximumLengthValidationRule: function MaximumLengthValidationRule(newValue, threshold) {
            return 'ne doit pas contenir plus de ' + threshold + ' caractères';
          },
          MaximumValueValidationRule: function MaximumValueValidationRule(newValue, threshold) {
            return 'doit être moins que ' + threshold;
          },
          NumericValidationRule: function NumericValidationRule(newValue, threshold) {
            return 'doit être une valeur numérique';
          },
          RegexValidationRule: function RegexValidationRule(newValue, threshold) {
            return 'n\'est pas une valeur valide';
          },
          StrongPasswordValidationRule: function StrongPasswordValidationRule(newValue, threshold) {
            if (threshold == 4) {
              return 'doit contenir une combinaison de lettres minuscules, de lettres majuscules, de caractères numériques et de caractères spéciaux';
            } else {
              return 'doit contenir au moins ' + threshold + ' des caractéristiques suivantes : lettres minuscules, lettres majuscules, caractères numériques ou caractères spéciaux';
            }
          }
        }
      };

      _export('data', data);
    }
  };
});