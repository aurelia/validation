System.register([], function (_export) {
  var data;
  return {
    setters: [],
    execute: function () {
      'use strict';

      data = {
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
          AlphaValidationRule: function AlphaValidationRule(newValue, threshold) {
            return 'kan enkel letters bevatten';
          },
          AlphaOrWhitespaceValidationRule: function AlphaOrWhitespaceValidationRule(newValue, threshold) {
            return 'kan enkel letters of spaties bevatten';
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
            return 'moet ' + threshold.otherValue + ' zijn';
          },
          InEqualityValidationRule: function InEqualityValidationRule(newValue, threshold) {
            return 'mag niet ' + threshold.otherValue + ' zijn';
          },
          EqualityWithOtherLabelValidationRule: function EqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'moet overeen komen met ' + threshold.otherValueLabel;
          },
          InEqualityWithOtherLabelValidationRule: function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'mag niet overeen komen met ' + threshold.otherValueLabel;
          },
          InCollectionValidationRule: function InCollectionValidationRule(newValue, threshold) {
            return 'is geen geldige waarde';
          },
          MinimumInclusiveValueValidationRule: function MinimumInclusiveValueValidationRule(newValue, threshold) {
            return 'moet op zijn minst ' + threshold + ' zijn';
          },
          MinimumLengthValidationRule: function MinimumLengthValidationRule(newValue, threshold) {
            return 'moet op zijn minst ' + threshold + ' tekens lang zijn';
          },
          MinimumValueValidationRule: function MinimumValueValidationRule(newValue, threshold) {
            return 'moet op meer dan ' + threshold + ' zijn';
          },
          MaximumInclusiveValueValidationRule: function MaximumInclusiveValueValidationRule(newValue, threshold) {
            return 'moet op zijn meest ' + threshold + ' zijn';
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
          ContainsOnlyValidationRule: function ContainsOnlyValidationRule(newValue, threshold) {
            return 'is geen geldige waarde';
          },
          StrongPasswordValidationRule: function StrongPasswordValidationRule(newValue, threshold) {
            return 'moet een combinatie van letters, hoofdletters, cijfers en speciale tekens zijn';
          },
          MediumPasswordValidationRule: function MediumPasswordValidationRule(newValue, threshold) {
            return 'moet op zijn minst ' + threshold + ' van de volgende groupen bevatten: letters, hoofdletters, cijfers of speciale tekens';
          }
        }
      };

      _export('data', data);
    }
  };
});