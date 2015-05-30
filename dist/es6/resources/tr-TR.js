import {Utilities} from '../validation/utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+)(?:\,\d+)?$/
  },
  messages: {
    'isRequired': 'gereklidir',
    'onValidateCallback' : 'geçerli bir değer giriniz',
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
      return `uzunluğu ${Utilities.getValue(threshold.minimumLength)} ile ${Utilities.getValue(threshold.maximumLength)} arasında olmalıdır`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `${Utilities.getValue(threshold.minimumValue)} ile ${Utilities.getValue(threshold.maximumValue)} arasında bir değer giriniz`;
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
      return `değer ${Utilities.getValue(threshold.otherValue)}''e eşit olmalıdır`;
    },
    'InEqualityValidationRule' : (newValue, threshold) => {
      return `değer ${Utilities.getValue(threshold.otherValue)}''den farklı olmalıdır`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `değer ${Utilities.getValue(threshold.otherValueLabel)}''e eşit olmalıdır`;
    },
    'InEqualityWithOtherLabelValidationRule' : (newValue, threshold) => {
      return `değer ${Utilities.getValue(threshold.otherValueLabel)}''den farklı olmalıdır`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `geçersiz değer`;
    },
    'MinimumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `değer ${Utilities.getValue(threshold)} veya daha fazla olmalıdır`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `değer en az ${Utilities.getValue(threshold)} karakter uzunluğunda olmalıdır`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `daha fazla olmalıdır ${Utilities.getValue(threshold)}`;
    },
    'MaximumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `değer ${Utilities.getValue(threshold)}''dan az olmalı`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `değer ${Utilities.getValue(threshold)} karakterden uzun olmamalıdır`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `değer ${Utilities.getValue(threshold)}''dan az olmalı`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `sadece sayı girebilirsiniz`;
    },
    'NoSpacesValidationRule' : (newValue, threshold) => {
      return `boşluk içeremez`;
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
      return `küçük harfler, büyük harfler, sayılar veya işaretlerden en az ${Utilities.getValue(threshold)} değişik tip olmalı`;
    },
    'URLValidationRule' : (newValue, threshold) =>{
      return `Geçerli bir URL değil`
    }
  }
};
