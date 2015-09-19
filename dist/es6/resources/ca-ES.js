import {Utilities} from '../utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'és requerit',
    'onValidateCallback': 'no és un valor vàlid',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return 'només pot contenir caràcters alfanumèrics o espais';
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return 'només pot contenir caràcters alfanumèrics';
    },
    'AlphaValidationRule': (newValue, threshold) => {
      return 'només pot contenir lletres';
    },
    'AlphaOrWhitespaceValidationRule': (newValue, threshold) => {
      return 'només pot contenir lletres o espais';
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return 'el nombre de caràcters ha d\'estar entre ' + Utilities.getValue(threshold.minimumLength) + ' i ' + Utilities.getValue(threshold.maximumLength);
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return 'ha d\'estar entre ' + Utilities.getValue(threshold.minimumValue) + ' i ' + Utilities.getValue(threshold.maximumValue);
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return 'no és un valor vàlid';
    },
    'DigitValidationRule': (newValue, threshold) => {
      return 'pot contenir només dígits';
    },
    'EmailValidationRule': (newValue, threshold) => {
      return 'no és una adreça de correu electrònic vàlida';
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return 'hauria de ser ' + Utilities.getValue(threshold.otherValue);
    },
    'InEqualityValidationRule': (newValue, threshold) => {
      return 'no pot ser ' + Utilities.getValue(threshold.otherValue);
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return 'no coincideix ' + Utilities.getValue(threshold.otherValueLabel);
    },
    'InEqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return 'no pot coincidir ' + Utilities.getValue(threshold.otherValueLabel);
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return 'no és un valor vàlid';
    },
    'MinimumInclusiveValueValidationRule': (newValue, threshold) => {
      return 'ha de ser ' + Utilities.getValue(threshold) + ' o més';
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return 'ha de tenir almenys ' + Utilities.getValue(threshold) + ' caràcters';
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return 'ha de ser major que ' + Utilities.getValue(threshold);
    },
    'MaximumInclusiveValueValidationRule': (newValue, threshold) => {
      return 'ha de ser ' + Utilities.getValue(threshold) + ' o menys';
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return 'no pot ser més llarg de ' + Utilities.getValue(threshold) + ' caràcters';
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return 'ha de ser menor que ' + Utilities.getValue(threshold);
    },
    'NumericValidationRule': (newValue, threshold) => {
      return 'ha de ser un nombre';
    },
    'NoSpacesValidationRule': (newValue, threshold) => {
      return 'no pot contenit espais';
    },
    'RegexValidationRule': (newValue, threshold) => {
      return 'no és un valor vàlid';
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return 'no és un valor vàlid';
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return 'ha de contenir una combinació de lletres minúscules, majúscules, números i caràcters especials';
    },
    'MediumPasswordValidationRule': (newValue, threshold) => {
      return 'ha de contenir almenys ' + Utilities.getValue(threshold) + ' dels següents grups: lletres minúscules, majúscules, números o caràcters especials';
    },
    'URLValidationRule': (newValue, threshold) => {
      return 'no és una URL vàlida';
    }
  }
};
