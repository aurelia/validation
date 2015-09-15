import {Utilities} from '../utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'er påkrevd',
    'onValidateCallback': 'ikkje gyldig verdi',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `kan berre innehalde alfanumeriske teikn eller mellomrom`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `kan berre innehalde alfanumeriske teikn`;
    },
    'AlphaValidationRule': (newValue, threshold) => {
      return `kan berre innehalde bokstavar`;
    },
    'AlphaOrWhitespaceValidationRule': (newValue, threshold) => {
      return `kan berre innehalde bokstavar og mellomrom`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `skal vere mellom ${Utilities.getValue(threshold.minimumLength)} og ${Utilities.getValue(threshold.maximumLength)} teikn langt`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `skal vere mellom ${Utilities.getValue(threshold.minimumValue)} og ${Utilities.getValue(threshold.maximumValue)}`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `ikkje ein gyldig verdi`;
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `kan berre innehalde tal`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `ikkje ei gyldig e-postadresse`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `burde vere ${Utilities.getValue(threshold.otherValue)}`;
    },
    'InEqualityValidationRule': (newValue, threshold) => {
      return `kan ikkje vere ${Utilities.getValue(threshold.otherValue)}`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `er ikkje like ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InEqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `kan ikkje vere like ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `ikkje ein gyldig verdi`;
    },
    'MinimumInclusiveValueValidationRule': (newValue, threshold) => {
      return `skal vere ${Utilities.getValue(threshold)} eller høgare`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `skal vere minst ${Utilities.getValue(threshold)} teikn langt`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `skal vere større enn ${Utilities.getValue(threshold)}`;
    },
    'MaximumInclusiveValueValidationRule': (newValue, threshold) => {
      return `skal vere ${Utilities.getValue(threshold)} eller mindre`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `kan ikkje vere lengre enn ${Utilities.getValue(threshold)} teikn`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `skal vere mindre enn ${Utilities.getValue(threshold)}`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `skal vere ein talverdi`;
    },
    'NoSpacesValidationRule': (newValue, threshold) => {
      return `kan ikkje innehalde mellomrom`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `ikkje ein gyldig verdi`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `ikkje ein gyldig verdi`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `skal vere ein kombinasjon av små bokstavar, store bokstavar, tall og spesialteikn`;
    },
    'MediumPasswordValidationRule': (newValue, threshold) => {
      return `skal innehalde minst ${Utilities.getValue(threshold)} av dei følgjande gruppene: små bokstavar, store bokstavar, tal og spesialteikn`;
    },
    'URLValidationRule': (newValue, threshold) => {
      return `ikkje ein gyldig URL`;
    }
  }
};
