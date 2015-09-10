define(['exports', '../validation/utilities'], function (exports, _validationUtilities) {
  'use strict';

  exports.__esModule = true;
  var data = {
    settings: {
      'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
    },
    messages: {
      'isRequired': 'és requerit',
      'onValidateCallback': 'no és un valor vàlid',
      'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
        return 'només pot contenir caràcters alfanumèrics o espais';
      },
      'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
        return 'només pot contenir caràcters alfanumèrics';
      },
      'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
        return 'només pot contenir lletres';
      },
      'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
        return 'només pot contenir lletres o espais';
      },
      'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
        return 'el nombre de caràcters ha d\'estar entre ' + _validationUtilities.Utilities.getValue(threshold.minimumLength) + ' i ' + _validationUtilities.Utilities.getValue(threshold.maximumLength);
      },
      'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
        return 'ha d\'estar entre ' + _validationUtilities.Utilities.getValue(threshold.minimumValue) + ' i ' + _validationUtilities.Utilities.getValue(threshold.maximumValue);
      },
      'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
        return 'no és un valor vàlid';
      },
      'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
        return 'pot contenir només dígits';
      },
      'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
        return 'no és una adreça de correu electrònic vàlida';
      },
      'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
        return 'hauria de ser ' + _validationUtilities.Utilities.getValue(threshold.otherValue);
      },
      'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
        return 'no pot ser ' + _validationUtilities.Utilities.getValue(threshold.otherValue);
      },
      'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'no coincideix ' + _validationUtilities.Utilities.getValue(threshold.otherValueLabel);
      },
      'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'no pot coincidir ' + _validationUtilities.Utilities.getValue(threshold.otherValueLabel);
      },
      'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
        return 'no és un valor vàlid';
      },
      'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
        return 'ha de ser ' + _validationUtilities.Utilities.getValue(threshold) + ' o més';
      },
      'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
        return 'ha de tenir almenys ' + _validationUtilities.Utilities.getValue(threshold) + ' caràcters';
      },
      'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
        return 'ha de ser major que ' + _validationUtilities.Utilities.getValue(threshold);
      },
      'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
        return 'ha de ser ' + _validationUtilities.Utilities.getValue(threshold) + ' o menys';
      },
      'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
        return 'no pot ser més llarg de ' + _validationUtilities.Utilities.getValue(threshold) + ' caràcters';
      },
      'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
        return 'ha de ser menor que ' + _validationUtilities.Utilities.getValue(threshold);
      },
      'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
        return 'ha de ser un nombre';
      },
      'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
        return 'no pot contenit espais';
      },
      'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
        return 'no és un valor vàlid';
      },
      'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
        return 'no és un valor vàlid';
      },
      'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
        return 'ha de contenir una combinació de lletres minúscules, majúscules, números i caràcters especials';
      },
      'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
        return 'ha de contenir almenys ' + _validationUtilities.Utilities.getValue(threshold) + ' dels següents grups: lletres minúscules, majúscules, números o caràcters especials';
      },
      'URLValidationRule': function URLValidationRule(newValue, threshold) {
        return 'no és una URL vàlida';
      }
    }
  };
  exports.data = data;
});