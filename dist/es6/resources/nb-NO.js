import {Utilities} from '../utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'er påkrevd',
    'onValidateCallback': 'ikke gyldig verdi',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `kan kun inneholde alfanumeriske tegn eller mellomrom`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `kan kun inneholde alfanumeriske tegn`;
    },
    'AlphaValidationRule': (newValue, threshold) => {
      return `kan kun inneholde bokstaver`;
    },
    'AlphaOrWhitespaceValidationRule': (newValue, threshold) => {
      return `kan kun inneholde bokstaver og mellomrom`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `skal være mellom ${Utilities.getValue(threshold.minimumLength)} og ${Utilities.getValue(threshold.maximumLength)} tegn langt`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `skal være mellom ${Utilities.getValue(threshold.minimumValue)} og ${Utilities.getValue(threshold.maximumValue)}`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `ikke en gyldig verdi`;
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `kan kun inneholde tall`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `ikke en gyldig e-postadresse`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `burde være ${Utilities.getValue(threshold.otherValue)}`;
    },
    'InEqualityValidationRule': (newValue, threshold) => {
      return `kan ikke være ${Utilities.getValue(threshold.otherValue)}`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `er ikke like ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InEqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `kan ikke være like ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `ikke en gyldig verdi`;
    },
    'MinimumInclusiveValueValidationRule': (newValue, threshold) => {
      return `skal være ${Utilities.getValue(threshold)} eller høyere`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `skal være minst ${Utilities.getValue(threshold)} tegn langt`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `skal være større enn ${Utilities.getValue(threshold)}`;
    },
    'MaximumInclusiveValueValidationRule': (newValue, threshold) => {
      return `skal være ${Utilities.getValue(threshold)} eller mindre`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `kan ikke være lengre enn ${Utilities.getValue(threshold)} tegn`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `skal være mindre enn ${Utilities.getValue(threshold)}`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `skal være en tallverdi`;
    },
    'NoSpacesValidationRule': (newValue, threshold) => {
      return `kan ikke inneholde mellomrom`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `ikke en gyldig verdi`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `ikke en gyldig verdi`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `skal være en kombinasjon av små bokstaver, store bokstaver, tall og spesialtegn`;
    },
    'MediumPasswordValidationRule': (newValue, threshold) => {
      return `skal inneholde minst ${Utilities.getValue(threshold)} av følgende grupper: små bokstaver, store bokstaver, tall og spesialtegn`;
    },
    'URLValidationRule': (newValue, threshold) => {
      return `ikke en gyldig URL`;
    }
  }
};
