'use strict';

System.register(['../utilities'], function (_export, _context) {
  var Utilities, data;
  return {
    setters: [function (_utilities) {
      Utilities = _utilities.Utilities;
    }],
    execute: function () {
      _export('data', data = {
        settings: {
          'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
        },
        messages: {
          'isRequired': 'er påkrevd',
          'onValidateCallback': 'ikkje gyldig verdi',
          'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
            return 'kan berre innehalde alfanumeriske teikn eller mellomrom';
          },
          'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
            return 'kan berre innehalde alfanumeriske teikn';
          },
          'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
            return 'kan berre innehalde bokstavar';
          },
          'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
            return 'kan berre innehalde bokstavar og mellomrom';
          },
          'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
            return 'skal vere mellom ' + Utilities.getValue(threshold.minimumLength) + ' og ' + Utilities.getValue(threshold.maximumLength) + ' teikn langt';
          },
          'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
            return 'skal vere mellom ' + Utilities.getValue(threshold.minimumValue) + ' og ' + Utilities.getValue(threshold.maximumValue);
          },
          'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
            return 'ikkje ein gyldig verdi';
          },
          'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
            return 'kan berre innehalde tal';
          },
          'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
            return 'ikkje ei gyldig e-postadresse';
          },
          'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
            return 'burde vere ' + Utilities.getValue(threshold.otherValue);
          },
          'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
            return 'kan ikkje vere ' + Utilities.getValue(threshold.otherValue);
          },
          'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'er ikkje like ' + Utilities.getValue(threshold.otherValueLabel);
          },
          'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
            return 'kan ikkje vere like ' + Utilities.getValue(threshold.otherValueLabel);
          },
          'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
            return 'ikkje ein gyldig verdi';
          },
          'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
            return 'skal vere ' + Utilities.getValue(threshold) + ' eller høgare';
          },
          'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
            return 'skal vere minst ' + Utilities.getValue(threshold) + ' teikn langt';
          },
          'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
            return 'skal vere større enn ' + Utilities.getValue(threshold);
          },
          'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
            return 'skal vere ' + Utilities.getValue(threshold) + ' eller mindre';
          },
          'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
            return 'kan ikkje vere lengre enn ' + Utilities.getValue(threshold) + ' teikn';
          },
          'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
            return 'skal vere mindre enn ' + Utilities.getValue(threshold);
          },
          'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
            return 'skal vere ein talverdi';
          },
          'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
            return 'kan ikkje innehalde mellomrom';
          },
          'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
            return 'ikkje ein gyldig verdi';
          },
          'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
            return 'ikkje ein gyldig verdi';
          },
          'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
            return 'skal vere ein kombinasjon av små bokstavar, store bokstavar, tall og spesialteikn';
          },
          'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
            return 'skal innehalde minst ' + Utilities.getValue(threshold) + ' av dei følgjande gruppene: små bokstavar, store bokstavar, tal og spesialteikn';
          },
          'URLValidationRule': function URLValidationRule(newValue, threshold) {
            return 'ikkje ein gyldig URL';
          }
        }
      });

      _export('data', data);
    }
  };
});