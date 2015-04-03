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
      if (threshold.otherValueLabel)
        if (threshold.equality)
          return `matchar inte ${threshold.otherValueLabel}`;
        else
          return `får inte matcha ${threshold.otherValueLabel}`;
      else if (threshold.equality)
        return `ska vara ${threshold.otherValue}`;
      else
        return `kan inte vara ${threshold.otherValue}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `är inget giltigt värde`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `behöver vara minst ${threshold} tecken långt`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `måste vara ${threshold} eller mer`;
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
    'StrongPasswordValidationRule': (newValue, threshold) => {
      if (threshold == 4)
        return `ska innehålla en kombination av gemener, versaler, siffror och specialtecken`;
      else
        return `ska innehålla minst ${threshold} av följande grupperingar: gemener, versaler, siffror eller specialtecken`;
    }
  }
}
