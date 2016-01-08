import {Utilities} from '../utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'je povinné',
    'onValidateCallback': 'nie je platná hodnota',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `môže obsahovať iba alfanumerické znaky alebo medzery`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `môže obsahovať iba alfanumerické znaky`;
    },
    'AlphaValidationRule': (newValue, threshold) => {
      return `môže obsahovať iba písmena`;
    },
    'AlphaOrWhitespaceValidationRule': (newValue, threshold) => {
      return `môže obsahovať iba písmena alebo medzery`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `dĺžka musí byť medzi ${Utilities.getValue(threshold.minimumLength)} a ${Utilities.getValue(threshold.maximumLength)} znakov`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `hodnota musí byť medzi ${Utilities.getValue(threshold.minimumValue)} a ${Utilities.getValue(threshold.maximumValue)}`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `nie je platná hodnota`;
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `môže obsahovať iba čísla`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `nie je platná e-mailová adresa`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `má byť ${Utilities.getValue(threshold.otherValue)}`;
    },
    'InEqualityValidationRule': (newValue, threshold) => {
      return `nemôže byť ${Utilities.getValue(threshold.otherValue)}`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `nezhoduje sa s ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InEqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `nemôže sa zhodovať s ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `nie je platná hodnota`;
    },
    'MinimumInclusiveValueValidationRule': (newValue, threshold) => {
      return `musí byť najmenej ${Utilities.getValue(threshold)}`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `dĺžka musí byť najmenej ${Utilities.getValue(threshold)} znakov`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `musí byť väčšie ako ${Utilities.getValue(threshold)}`;
    },
    'MaximumInclusiveValueValidationRule': (newValue, threshold) => {
      return `musí byť najviac ${Utilities.getValue(threshold)}`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `nemôže byť dlhžie ako ${Utilities.getValue(threshold)} znakov`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `musí byť menšie ako ${Utilities.getValue(threshold)}`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `musí byť číslo`;
    },
    'NoSpacesValidationRule': (newValue, threshold) => {
      return `nesmie obsahovať medzery`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `nie je platná hodnota`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `nie je platná hodnota`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `musí obsahovať kombináciu malých a veľkých písmen, číslic a špeciálnych znakov`;
    },
    'MediumPasswordValidationRule': (newValue, threshold) => {
      return `should contain at least ${Utilities.getValue(threshold)} of the following groups: lowercase letters, uppercase letters, digits or special characters`;
      return `musí obsahovať aspoň ${Utilities.getValue(threshold)} znakov z malých a veľkých písmen, číslic a špeciálnych znakov`;
    },
    'URLValidationRule': (newValue, threshold) => {
      return `nie je platná adresa URL`;
    }
  }
};
