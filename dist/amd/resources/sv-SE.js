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
        return 'måste vara mellan ' + threshold.minimumLength + ' och ' + threshold.maximumLength + ' tecken långt';
      },
      BetweenValueValidationRule: function BetweenValueValidationRule(newValue, threshold) {
        return 'måste vara mellan ' + threshold.minimumValue + ' och ' + threshold.maximumValue;
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
        return 'ska vara ' + threshold.otherValue;
      },
      InEqualityValidationRule: function InEqualityValidationRule(newValue, threshold) {
        return 'kan inte vara ' + threshold.otherValue;
      },
      EqualityWithOtherLabelValidationRule: function EqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'matchar inte ' + threshold.otherValueLabel;
      },
      InEqualityWithOtherLabelValidationRule: function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'får inte matcha ' + threshold.otherValueLabel;
      },
      InCollectionValidationRule: function InCollectionValidationRule(newValue, threshold) {
        return 'är inget giltigt värde';
      },
      MinimumLengthValidationRule: function MinimumLengthValidationRule(newValue, threshold) {
        return 'behöver vara minst ' + threshold + ' tecken långt';
      },
      MinimumValueValidationRule: function MinimumValueValidationRule(newValue, threshold) {
        return 'måste vara ' + threshold + ' eller mer';
      },
      MaximumLengthValidationRule: function MaximumLengthValidationRule(newValue, threshold) {
        return 'kan inte vara längre än ' + threshold + ' tecken';
      },
      MaximumValueValidationRule: function MaximumValueValidationRule(newValue, threshold) {
        return 'måste vara mindre än ' + threshold;
      },
      NumericValidationRule: function NumericValidationRule(newValue, threshold) {
        return 'måste vara ett nummer';
      },
      RegexValidationRule: function RegexValidationRule(newValue, threshold) {
        return 'är inte ett giltigt värde';
      },
      StrongPasswordValidationRule: function StrongPasswordValidationRule(newValue, threshold) {
        return 'ska innehålla en kombination av gemener, versaler, siffror och specialtecken';
      },
      MediumPasswordValidationRule: function MediumPasswordValidationRule(newValue, threshold) {
        return 'ska innehålla minst ' + threshold + ' av följande grupperingar: gemener, versaler, siffror eller specialtecken';
      }
    }
  };
  exports.data = data;
});