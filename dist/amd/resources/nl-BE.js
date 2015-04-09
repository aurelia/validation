define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var data = {
    settings: {
      numericRegex: /^-?(?:\d+)(?:\,\d+)?$/
    },
    messages: {
      isRequired: 'is verplicht',
      AlphaNumericOrWhitespaceValidationRule: function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
        return 'kan enkel alfanumerieke tekens of spaties bevatten';
      },
      AlphaNumericValidationRule: function AlphaNumericValidationRule(newValue, threshold) {
        return 'kan enkel alfanumerieke tekens bevatten';
      },
      BetweenLengthValidationRule: function BetweenLengthValidationRule(newValue, threshold) {
        return 'moet tussen ' + threshold.minimumLength + ' en ' + threshold.maximumLength + ' tekens lang zijn';
      },
      BetweenValueValidationRule: function BetweenValueValidationRule(newValue, threshold) {
        return 'moet tussen ' + threshold.minimumValue + ' en ' + threshold.maximumValue + ' zijn';
      },
      DigitValidationRule: function DigitValidationRule(newValue, threshold) {
        return 'mag enkel cijfers bevatten';
      },
      CustomFunctionValidationRule: function CustomFunctionValidationRule(newValue, threshold) {
        return 'geen geldige waarde';
      },
      EmailValidationRule: function EmailValidationRule(newValue, threshold) {
        return 'is geen geldig email adres';
      },
      EqualityValidationRule: function EqualityValidationRule(newValue, threshold) {
        if (threshold.otherValueLabel) if (threshold.equality) {
          return 'moet overeen komen met ' + threshold.otherValueLabel;
        } else {
          return 'mag niet overeen komen met ' + threshold.otherValueLabel;
        } else if (threshold.equality) {
          return 'moet ' + threshold.otherValue + ' zijn';
        } else {
          return 'mag niet ' + threshold.otherValue + ' zijn';
        }
      },
      InCollectionValidationRule: function InCollectionValidationRule(newValue, threshold) {
        return 'is geen geldige waarde';
      },
      MinimumLengthValidationRule: function MinimumLengthValidationRule(newValue, threshold) {
        return 'moet op zijn minst ' + threshold + ' tekens lang zijn';
      },
      MinimumValueValidationRule: function MinimumValueValidationRule(newValue, threshold) {
        return 'moet op zijn minst ' + threshold + ' zijn';
      },
      MaximumLengthValidationRule: function MaximumLengthValidationRule(newValue, threshold) {
        return 'moet minder dan ' + threshold + ' tekens lang zijn';
      },
      MaximumValueValidationRule: function MaximumValueValidationRule(newValue, threshold) {
        return 'moet minder dan ' + threshold + ' zijn';
      },
      NumericValidationRule: function NumericValidationRule(newValue, threshold) {
        return 'moet een getal zijn';
      },
      RegexValidationRule: function RegexValidationRule(newValue, threshold) {
        return 'is geen geldige waarde';
      },
      StrongPasswordValidationRule: function StrongPasswordValidationRule(newValue, threshold) {
        if (threshold == 4) {
          return 'moet een combinatie van letters, hoofdletters, cijfers en speciale tekens zijn';
        } else {
          return 'moet op zijn minst ' + threshold + ' van de volgende groupen bevatten: letters, hoofdletters, cijfers of speciale tekens';
        }
      }
    }
  };
  exports.data = data;
});