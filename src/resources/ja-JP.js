import {Utilities} from '../utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': '必ず入力してください。',
    'onValidateCallback': '無効な入力値です。',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `英数字または半角スペースのみ入力可能です。`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `半角英数字のみ入力可能です。`;
    },
    'AlphaValidationRule': (newValue, threshold) => {
      return `半角アルファベットのみ入力可能です。`;
    },
    'AlphaOrWhitespaceValidationRule': (newValue, threshold) => {
      return `半角アルファベットまたは半角スペースのみ入力可能です。`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `${Utilities.getValue(threshold.minimumLength)}文字以上${Utilities.getValue(threshold.maximumLength)}文字以内で入力してください。`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `${Utilities.getValue(threshold.minimumValue)}以上${Utilities.getValue(threshold.maximumValue)}以内で入力してください。`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `無効な入力値です。`;
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `数字のみ入力可能です。`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `無効なメールアドレスです。`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `${Utilities.getValue(threshold.otherValue)}である必要があります。`;
    },
    'InEqualityValidationRule': (newValue, threshold) => {
      return `${Utilities.getValue(threshold.otherValue)}は指定できません。`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `${Utilities.getValue(threshold.otherValueLabel)}と一致しません。`;
    },
    'InEqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `${Utilities.getValue(threshold.otherValueLabel)}と同じ値は指定できません。`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `無効な入力値です。`;
    },
    'MinimumInclusiveValueValidationRule': (newValue, threshold) => {
      return `${Utilities.getValue(threshold)}以上である必要があります。`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `${Utilities.getValue(threshold)}文字以上入力してください。`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `${Utilities.getValue(threshold)}より大きな値を指定してください。`;
    },
    'MaximumInclusiveValueValidationRule': (newValue, threshold) => {
      return `${Utilities.getValue(threshold)}以下である必要があります。`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `${Utilities.getValue(threshold)}文字以下で入力してください。`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `${Utilities.getValue(threshold)}より小さい値を指定してください。`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `数値を入力してください。`;
    },
    'NoSpacesValidationRule': (newValue, threshold) => {
      return `空白は含めないでください。`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `無効な入力値です。`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `無効な入力値です。`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `小文字、大文字、数字、および記号をそれぞれ含める必要があります。`;
    },
    'MediumPasswordValidationRule': (newValue, threshold) => {
      return `小文字、大文字、数字、記号のうち${Utilities.getValue(threshold)}種類の文字を含める必要があります。`;
    },
    'URLValidationRule': (newValue, threshold) => {
      return `無効なURLです。`;
    }
  }
};
