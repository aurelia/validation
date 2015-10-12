import {Utilities} from '../utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+)(?:\,\d+)?$/
  },
  messages: {
    'isRequired': 'är obligatoriskt',
    'onValidateCallback': 'är inte ett giltigt värde',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `kan enbart innehålla alfanumeriska tecken eller mellanslag`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `kan enbart innehålla alfanumeriska tecken`;
    },
    'AlphaValidationRule': (newValue, threshold) => {
      return `kan enbart innehålla bokstäver eller mellanslag`;
    },
    'AlphaOrWhitespaceValidationRule': (newValue, threshold) => {
      return `kan enbart innehålla bokstäver`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `måste vara mellan ${Utilities.getValue(threshold.minimumLength)} och ${Utilities.getValue(threshold.maximumLength)} tecken långt`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `måste vara mellan ${Utilities.getValue(threshold.minimumValue)} och ${Utilities.getValue(threshold.maximumValue)}`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `är inte ett giltigt värde`;
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `kan bara innehålla siffror`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `är inte en giltig e-postadress`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `ska vara ${Utilities.getValue(threshold.otherValue)}`;
    },
    'InEqualityValidationRule': (newValue, threshold) => {
      return `kan inte vara ${Utilities.getValue(threshold.otherValue)}`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `matchar inte ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InEqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `får inte matcha ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `är inget giltigt värde`;
    },
    'MinimumInclusiveValueValidationRule': (newValue, threshold) => {
      return `måste vara ${Utilities.getValue(threshold)} eller mer`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `behöver vara minst ${Utilities.getValue(threshold)} tecken långt`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `måste vara mer än ${Utilities.getValue(threshold)}`;
    },
    'MaximumInclusiveValueValidationRule': (newValue, threshold) => {
      return `måste vara ${Utilities.getValue(threshold)} eller mindre`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `kan inte vara längre än ${Utilities.getValue(threshold)} tecken`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `måste vara mindre än ${Utilities.getValue(threshold)}`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `måste vara ett nummer`;
    },
    'NoSpacesValidationRule': (newValue, threshold) => {
      return `kan inte innehålla mellanslag`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `är inte ett giltigt värde`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `är inte ett giltigt värde`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `ska innehålla en kombination av gemener, versaler, siffror och specialtecken`;
    },
    'MediumPasswordValidationRule': (newValue, threshold) => {
      return `ska innehålla minst ${Utilities.getValue(threshold)} av följande grupperingar: gemener, versaler, siffror eller specialtecken`;
    },
    'URLValidationRule': (newValue, threshold) => {
      return `är inte en giltig webbadress`;
    }
  }
};
