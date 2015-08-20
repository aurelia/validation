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
          'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
        },
        messages: {
          'isRequired': 'er påkrævet',
          'onValidateCallback': 'ikke gyldig værdi',
          'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
            return 'kan kun indeholde alfanumeriske tegn eller mellemrum';
          },
          'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
            return 'kan kun indeholde alfanumeriske tegn';
          },
          'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
            return 'kan kun indeholde bogstaver';
          },
          'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
            return 'kan kun indeholde bogstaver og mellemrum';
          },
          'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
            return 'skal være imellem ' + Utilities.getValue(threshold.minimumLength) + ' og ' + Utilities.getValue(threshold.maximumLength) + ' tegn lang';
          },
          'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
            return 'skal være imellem ' + Utilities.getValue(threshold.minimumValue) + ' og ' + Utilities.getValue(threshold.maximumValue);
          },
          'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
            return 'ikke en gyldig værdi';
          },
          'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
            return 'kan kun indeholde tal';
          },
          'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
            return 'ikke gyldig e-mailadresse';
          },
          'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
            return 'burde være ' + Utilities.getValue(threshold.otherValue);
          },
          'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
            return 'kan ikke være ' + Utilities.getValue(threshold.otherValue);
          },
          'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'er ikke ens ' + Utilities.getValue(threshold.otherValueLabel);
          },
          'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'kan ikke være ens ' + Utilities.getValue(threshold.otherValueLabel);
          },
          'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
            return 'ikke en gyldig værdi';
          },
          'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
            return 'skal være ' + Utilities.getValue(threshold) + ' eller højere';
          },
          'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
            return 'skal være mindst ' + Utilities.getValue(threshold) + ' tegn lang';
          },
          'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
            return 'skal være større end ' + Utilities.getValue(threshold);
          },
          'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
            return 'skal være ' + Utilities.getValue(threshold) + ' eller mindre';
          },
          'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
            return 'kan ikke være længere end ' + Utilities.getValue(threshold) + ' tegn';
          },
          'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
            return 'skal være mindre end ' + Utilities.getValue(threshold);
          },
          'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
            return 'skal være en talværdi';
          },
          'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
            return 'må ikke indeholde mellemrum';
          },
          'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
            return 'ikke en gyldig værdi';
          },
          'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
            return 'ikke en gyldig værdi';
          },
          'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
            return 'skal være en kombination af små bogstaver, store bogstaver, tal og specialtegn';
          },
          'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
            return 'skal indeholde mindst ' + Utilities.getValue(threshold) + ' af de følgende grupper: små bogstaver, store bogstaver, tal og specialtegn';
          },
          'URLValidationRule': function URLValidationRule(newValue, threshold) {
            return 'ikke en gyldig URL';
          }
        }
      };

      _export('data', data);
    }
  };
});