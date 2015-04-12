System.register(['../validation/utilities'], function (_export) {
  var Utilities, data;
  return {
    setters: [function (_validationUtilities) {
      Utilities = _validationUtilities.Utilities;
    }],
    execute: function () {
      'use strict';

      data = {
        settings: {
          numericRegex: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
        },
        messages: {
          isRequired: 'är obligatoriskt',
          AlphaNumericOrWhitespaceValidationRule: function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
            return 'kan enbart innehålla alfanumeriska tecken eller mellanslag';
          },
          AlphaNumericValidationRule: function AlphaNumericValidationRule(newValue, threshold) {
            return 'kan enbart innehålla alfanumeriska tecken';
          },
          AlphaValidationRule: function AlphaValidationRule(newValue, threshold) {
            return 'kan enbart innehålla bokstäver eller mellanslag';
          },
          AlphaOrWhitespaceValidationRule: function AlphaOrWhitespaceValidationRule(newValue, threshold) {
            return 'kan enbart innehålla bokstäver';
          },
          BetweenLengthValidationRule: function BetweenLengthValidationRule(newValue, threshold) {
            return 'måste vara mellan ' + Utilities.getValue(threshold.minimumLength) + ' och ' + Utilities.getValue(threshold.maximumLength) + ' tecken långt';
          },
          BetweenValueValidationRule: function BetweenValueValidationRule(newValue, threshold) {
            return 'måste vara mellan ' + Utilities.getValue(threshold.minimumValue) + ' och ' + Utilities.getValue(threshold.maximumValue);
          },
          CustomFunctionValidationRule: function CustomFunctionValidationRule(newValue, threshold) {
            return 'är inte ett giltigt värde';
          },
          DigitValidationRule: function DigitValidationRule(newValue, threshold) {
            return 'kan bara innehålla siffror';
          },
          EmailValidationRule: function EmailValidationRule(newValue, threshold) {
            return 'är inte en giltig e-postadress';
          },
          EqualityValidationRule: function EqualityValidationRule(newValue, threshold) {
            return 'ska vara ' + Utilities.getValue(threshold.otherValue);
          },
          InEqualityValidationRule: function InEqualityValidationRule(newValue, threshold) {
            return 'kan inte vara ' + Utilities.getValue(threshold.otherValue);
          },
          EqualityWithOtherLabelValidationRule: function EqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'matchar inte ' + Utilities.getValue(threshold.otherValueLabel);
          },
          InEqualityWithOtherLabelValidationRule: function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'får inte matcha ' + Utilities.getValue(threshold.otherValueLabel);
          },
          InCollectionValidationRule: function InCollectionValidationRule(newValue, threshold) {
            return 'är inget giltigt värde';
          },
          MinimumInclusiveValueValidationRule: function MinimumInclusiveValueValidationRule(newValue, threshold) {
            return 'måste vara ' + Utilities.getValue(threshold) + ' eller mer';
          },
          MinimumLengthValidationRule: function MinimumLengthValidationRule(newValue, threshold) {
            return 'behöver vara minst ' + Utilities.getValue(threshold) + ' tecken långt';
          },
          MinimumValueValidationRule: function MinimumValueValidationRule(newValue, threshold) {
            return 'måste vara mer än ' + Utilities.getValue(threshold);
          },
          MaximumInclusiveValueValidationRule: function MaximumInclusiveValueValidationRule(newValue, threshold) {
            return 'måste vara ' + Utilities.getValue(threshold) + ' eller mindre';
          },
          MaximumLengthValidationRule: function MaximumLengthValidationRule(newValue, threshold) {
            return 'kan inte vara längre än ' + Utilities.getValue(threshold) + ' tecken';
          },
          MaximumValueValidationRule: function MaximumValueValidationRule(newValue, threshold) {
            return 'måste vara mindre än ' + Utilities.getValue(threshold);
          },
          NumericValidationRule: function NumericValidationRule(newValue, threshold) {
            return 'måste vara ett nummer';
          },
          RegexValidationRule: function RegexValidationRule(newValue, threshold) {
            return 'är inte ett giltigt värde';
          },
          ContainsOnlyValidationRule: function ContainsOnlyValidationRule(newValue, threshold) {
            return 'är inte ett giltigt värde';
          },
          StrongPasswordValidationRule: function StrongPasswordValidationRule(newValue, threshold) {
            return 'ska innehålla en kombination av gemener, versaler, siffror och specialtecken';
          },
          MediumPasswordValidationRule: function MediumPasswordValidationRule(newValue, threshold) {
            return 'ska innehålla minst ' + Utilities.getValue(threshold) + ' av följande grupperingar: gemener, versaler, siffror eller specialtecken';
          }
        }
      };

      _export('data', data);
    }
  };
});