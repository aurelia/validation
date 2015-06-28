System.register(['../validation/utilities'], function (_export) {
  'use strict';

  var Utilities, data;
  return {
    setters: [function (_validationUtilities) {
      Utilities = _validationUtilities.Utilities;
    }],
    execute: function () {
      data = {
        settings: {
          'numericRegex': /^-?(?:\d+)(?:\,\d+)?$/
        },
        messages: {
          'isRequired': 'est obligatoire',
          'onValidateCallback': 'n\'est pas une valeur valide',
          'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
            return 'ne peut contenir que des caractères alphanumériques ou des espaces';
          },
          'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
            return 'ne peut contenir que des caractères alphanumériques';
          },
          'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
            return 'ne peut contenir que des lettres';
          },
          'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
            return 'ne peut contenir que des lettres ou des espaces';
          },
          'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
            return 'doit contenir de ' + Utilities.getValue(threshold.minimumLength) + ' à ' + Utilities.getValue(threshold.maximumLength) + ' caractères';
          },
          'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
            return 'doit être entre ' + Utilities.getValue(threshold.minimumValue) + ' et ' + Utilities.getValue(threshold.maximumValue);
          },
          'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
            return 'n\'est pas une valeur valide';
          },
          'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
            return 'doit contenir uniquement des caractères numériques';
          },
          'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
            return 'n\'est pas une adresse email valide';
          },
          'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
            return 'doit être ' + Utilities.getValue(threshold.otherValue);
          },
          'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
            return 'ne peut pas être ' + Utilities.getValue(threshold.otherValue);
          },
          'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'doit correspondre à ' + Utilities.getValue(threshold.otherValueLabel);
          },
          'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'ne doit pas correspondre à ' + Utilities.getValue(threshold.otherValueLabel);
          },
          'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
            return 'n\'est pas une valeur valide';
          },
          'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
            return 'doit être ' + Utilities.getValue(threshold) + ' ou plus';
          },
          'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
            return 'doit contenir au moins ' + Utilities.getValue(threshold) + ' caractères';
          },
          'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
            return 'doit être plus que ' + Utilities.getValue(threshold);
          },
          'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
            return 'doit être moins que ' + Utilities.getValue(threshold);
          },
          'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
            return 'ne doit pas contenir plus de ' + Utilities.getValue(threshold) + ' caractères';
          },
          'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
            return 'doit être ' + Utilities.getValue(threshold) + ' ou moins';
          },
          'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
            return 'doit être une valeur numérique';
          },
          'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
            return 'ne peut pas contenir d\'espaces';
          },
          'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
            return 'n\'est pas une valeur valide';
          },
          'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
            return 'n\'est pas une valeur valide';
          },
          'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
            return 'doit contenir une combinaison de lettres minuscules, de lettres majuscules, de caractères numériques et de caractères spéciaux';
          },
          'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
            return 'doit contenir au moins ' + Utilities.getValue(threshold) + ' des caractéristiques suivantes : lettres minuscules, lettres majuscules, caractères numériques ou caractères spéciaux';
          },
          'URLValidationRule': function URLValidationRule(newValue, threshold) {
            return 'est pas un URL valide';
          }
        }
      };

      _export('data', data);
    }
  };
});