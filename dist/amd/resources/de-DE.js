define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var data = {
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
        if (threshold.otherValueLabel) if (threshold.equality) {
          return 'entspricht nicht ' + threshold.otherValueLabel;
        } else {
          return 'darf nicht mit ' + threshold.otherValueLabel + ' übereinstimmen';
        } else if (threshold.equality) {
          return 'sollte ' + threshold.otherValue + ' sein';
        } else {
          return 'sollte nicht ' + threshold.otherValue + ' sein';
        }
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
      StrongPasswordValidationRule: function StrongPasswordValidationRule(newValue, threshold) {
        if (threshold == 4) {
          return 'sollte eine Kombination aus Groß- und Kleinbuchstaben, sowie Zahlen und Sonderzeichen enthalten';
        } else {
          return 'sollte zumindest ' + threshold + ' der folgenden Gruppen enthalten: Kleinbuchstaben, Großbuchstaben, Zahlen oder Sonderzeichen';
        }
      }
    }
  };
  exports.data = data;
});