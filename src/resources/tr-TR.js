export
let
data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'gereklidir',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `sadece alfanumerik karakterler veya boşluk girebilirsiniz`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `sadece alfanumerik karakterleri girebilirsiniz`;
    },
    'AlphaValidationRule' : (newValue, threshold) => {
      return `sadece harf veya boşluk girebilirsiniz`;
    },
    'AlphaOrWhitespaceValidationRule' : (newValue, threshold) => {
      return `sadece harf veya boşluk girebilirsiniz`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `uzunluğu ${threshold.minimumLength} ile ${threshold.maximumLength} arasında olmalıdır`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `${threshold.minimumValue} ile ${threshold.maximumValue} arasında bir değer giriniz`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `geçerli bir değer giriniz`
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `sadece rakam girebilirsiniz`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `geçerli bir e-posta giriniz`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `değer ${threshold.otherValue}''e eşit olmalıdır`;
    },
    'InEqualityValidationRule' : (newValue, threshold) => {
      return `değer ${threshold.otherValue}''den farklı olmalıdır`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `değer ${threshold.otherValueLabel}''e eşit olmalıdır`;
    },
    'InEqualityWithOtherLabelValidationRule' : (newValue, threshold) => {
      return `değer ${threshold.otherValueLabel}''den farklı olmalıdır`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `geçersiz değer`;
    },
    'MinimumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `değer ${threshold} veya daha fazla olmalıdır`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `değer en az ${threshold} karakter uzunluğunda olmalıdır`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `daha fazla olmalıdır ${threshold}`;
    },
    'MaximumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `değer ${threshold}''dan az olmalı`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `değer ${threshold} karakterden uzun olmamalıdır`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `değer ${threshold}''dan az olmalı`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `sadece sayı girebilirsiniz`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `geçerli bir değer giriniz`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `geçerli bir değer giriniz`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `küçük harfler, büyük harfler, sayılar ve işaretlerin birleşimi olmalıdır`;
    },
    'MediumPasswordValidationRule' : (newValue, threshold) => {
      return `küçük harfler, büyük harfler, sayılar veya işaretlerden en az ${threshold} değişik tip olmalı`;
    }
  }
};
