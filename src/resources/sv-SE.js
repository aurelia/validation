export
let
data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'är obligatoriskt',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `kan enbart innehålla alfanumeriska tecken eller mellanslag`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `kan enbart innehålla alfanumeriska tecken`;
    },
    'AlphaValidationRule' : (newValue, threshold) => {
      return `kan enbart innehålla bokstäver eller mellanslag`;
    },
    'AlphaOrWhitespaceValidationRule' : (newValue, threshold) => {
      return `kan enbart innehålla bokstäver`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `måste vara mellan ${threshold.minimumLength} och ${threshold.maximumLength} tecken långt`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `måste vara mellan ${threshold.minimumValue} och ${threshold.maximumValue}`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `är inte ett giltigt värde`
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `kan bara innehålla siffror`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `är inte en giltig e-postadress`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
        return `ska vara ${threshold.otherValue}`;
    },
    'InEqualityValidationRule' : (newValue, threshold) => {
        return `kan inte vara ${threshold.otherValue}`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `matchar inte ${threshold.otherValueLabel}`;
    },
    'InEqualityWithOtherLabelValidationRule' : (newValue, threshold) => {
      return `får inte matcha ${threshold.otherValueLabel}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `är inget giltigt värde`;
    },
    'MinimumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `måste vara ${threshold} eller mer`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `behöver vara minst ${threshold} tecken långt`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `måste vara mer än ${threshold}`;
    },
    'MaximumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `måste vara ${threshold} eller mindre`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `kan inte vara längre än ${threshold} tecken`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `måste vara mindre än ${threshold}`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `måste vara ett nummer`;
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
    'MediumPasswordValidationRule' : (newValue, threshold) => {
      return `ska innehålla minst ${threshold} av följande grupperingar: gemener, versaler, siffror eller specialtecken`;
    }
  }
};
