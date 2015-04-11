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
          isRequired: 'wird benötigt',
          AlphaNumericOrWhitespaceValidationRule: function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
            return 'darf nur alphanumerische Zeichen oder Leerzeichen beinhalten';
          },
          AlphaNumericValidationRule: function AlphaNumericValidationRule(newValue, threshold) {
            return 'darf nur alphanumerische Zeichen beinhalten';
          },
          BetweenLengthValidationRule: function BetweenLengthValidationRule(newValue, threshold) {
            return 'muss zwischen ' + threshold.minimumLength + ' und ' + threshold.maximumLength + ' Zeichen lang sein';
          },
          BetweenValueValidationRule: function BetweenValueValidationRule(newValue, threshold) {
            return 'muss zwischen ' + threshold.minimumValue + ' und ' + threshold.maximumValue + ' sein';
          },
          CustomFunctionValidationRule: function CustomFunctionValidationRule(newValue, threshold) {
            return 'ist kein gültiger Wert';
          },
          DigitValidationRule: function DigitValidationRule(newValue, threshold) {
            return 'darf nur Zahlen beinhalten';
          },
          EmailValidationRule: function EmailValidationRule(newValue, threshold) {
            return 'ist keine gültige Email-Adresse';
          },
          EqualityValidationRule: function EqualityValidationRule(newValue, threshold) {
            return 'sollte ' + threshold.otherValue + ' sein';
          },
          InEqualityValidationRule: function InEqualityValidationRule(newValue, threshold) {
            return 'sollte nicht ' + threshold.otherValue + ' sein';
          },
          EqualityWithOtherLabelValidationRule: function EqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'darf nicht mit ' + threshold.otherValueLabel + ' übereinstimmen';
          },
          InEqualityWithOtherLabelValidationRule: function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'cannot not match ' + threshold.otherValueLabel;
          },
          InCollectionValidationRule: function InCollectionValidationRule(newValue, threshold) {
            return 'ist kein gültiger Wert';
          },
          MinimumLengthValidationRule: function MinimumLengthValidationRule(newValue, threshold) {
            return 'muss mindestens ' + threshold + ' Zeichen lang sein';
          },
          MinimumValueValidationRule: function MinimumValueValidationRule(newValue, threshold) {
            return 'sollte ' + threshold + ' oder mehr sein';
          },
          MaximumLengthValidationRule: function MaximumLengthValidationRule(newValue, threshold) {
            return 'darf nicht länger als ' + threshold + ' Zeichen sein';
          },
          MaximumValueValidationRule: function MaximumValueValidationRule(newValue, threshold) {
            return 'muss geringer als ' + threshold + ' sein';
          },
          NumericValidationRule: function NumericValidationRule(newValue, threshold) {
            return 'muss eine Nummer sein';
          },
          RegexValidationRule: function RegexValidationRule(newValue, threshold) {
            return 'ist kein gültiger Wert';
          },
          ContainsOnlyValidationRule: function ContainsOnlyValidationRule(newValue, threshold) {
            return 'ist kein gültiger Wert';
          },
          StrongPasswordValidationRule: function StrongPasswordValidationRule(newValue, threshold) {
            return 'sollte eine Kombination aus Groß- und Kleinbuchstaben, sowie Zahlen und Sonderzeichen enthalten';
          },
          MediumPasswordValidationRule: function MediumPasswordValidationRule(newValue, threshold) {
            return 'sollte zumindest ' + threshold + ' der folgenden Gruppen enthalten: Kleinbuchstaben, Großbuchstaben, Zahlen oder Sonderzeichen';
          }
        }
      };

      _export('data', data);
    }
  };
});