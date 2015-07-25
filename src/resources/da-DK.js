import {Utilities} from '../validation/utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'er påkrævet',
    'onValidateCallback' : 'ikke gyldig værdi',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `kan kun indeholde alfanumeriske tegn eller mellemrum`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `kan kun indeholde alfanumeriske tegn`;
    },
    'AlphaValidationRule' : (newValue, threshold) => {
      return `kan kun indeholde bogstaver`;
    },
    'AlphaOrWhitespaceValidationRule' : (newValue, threshold) => {
      return `kan kun indeholde bogstaver og mellemrum`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `skal være imellem ${Utilities.getValue(threshold.minimumLength)} og ${Utilities.getValue(threshold.maximumLength)} tegn lang`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `skal være imellem ${Utilities.getValue(threshold.minimumValue)} og ${Utilities.getValue(threshold.maximumValue)}`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `ikke en gyldig værdi`
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `kan kun indeholde tal`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `ikke gyldig e-mailadresse`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `burde være ${Utilities.getValue(threshold.otherValue)}`;
    },
    'InEqualityValidationRule' : (newValue, threshold) => {
        return `kan ikke være ${Utilities.getValue(threshold.otherValue)}`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `er ikke ens ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InEqualityWithOtherLabelValidationRule' : (newValue, threshold) => {
      return `kan ikke være ens ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `ikke en gyldig værdi`;
    },
    'MinimumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `skal være ${Utilities.getValue(threshold)} eller højere`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `skal være mindst ${Utilities.getValue(threshold)} tegn lang`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `skal være større end ${Utilities.getValue(threshold)}`;
    },
    'MaximumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `skal være ${Utilities.getValue(threshold)} eller mindre`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `kan ikke være længere end ${Utilities.getValue(threshold)} tegn`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `skal være mindre end ${Utilities.getValue(threshold)}`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `skal være en talværdi`;
    },
    'NoSpacesValidationRule' : (newValue, threshold) => {
      return `må ikke indeholde mellemrum`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `ikke en gyldig værdi`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `ikke en gyldig værdi`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `skal være en kombination af små bogstaver, store bogstaver, tal og specialtegn`;
    },
    'MediumPasswordValidationRule' : (newValue, threshold) => {
      return `skal indeholde mindst ${Utilities.getValue(threshold)} af de følgende grupper: små bogstaver, store bogstaver, tal og specialtegn`;
    },
    'URLValidationRule' : (newValue, threshold) =>{
      return `ikke en gyldig URL`
    }
  }
};
