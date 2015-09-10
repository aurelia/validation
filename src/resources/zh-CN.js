import {Utilities} from '../validation/utilities';

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': '必填字段',
    'onValidateCallback': '非法字段',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `不能使用特殊字符`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `只能包含字母数字字符`;
    },
    'AlphaValidationRule': (newValue, threshold) => {
      return `只能包含字母`;
    },
    'AlphaOrWhitespaceValidationRule': (newValue, threshold) => {
      return `只能包含字母或空格`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `字符长度应该在 ${Utilities.getValue(threshold.minimumLength)} ~ ${Utilities.getValue(threshold.maximumLength)} 之间`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `字符长度应该在 ${Utilities.getValue(threshold.minimumValue)} ~ ${Utilities.getValue(threshold.maximumValue)} 之间`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `不合法的值`;
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `只能包含数字`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `邮箱格式不正确`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `应该等于 ${Utilities.getValue(threshold.otherValue)}`;
    },
    'InEqualityValidationRule': (newValue, threshold) => {
      return `不应该等于 ${Utilities.getValue(threshold.otherValue)}`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `与 ${Utilities.getValue(threshold.otherValueLabel)} 不匹配`;
    },
    'InEqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `不应该和 ${Utilities.getValue(threshold.otherValueLabel)} 相等`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `不合法的值`;
    },
    'MinimumInclusiveValueValidationRule': (newValue, threshold) => {
      return `最小值为 ${Utilities.getValue(threshold)} (包含)`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `最小字符长度为 ${Utilities.getValue(threshold)}`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `最小值为 ${Utilities.getValue(threshold)}(不包含)`;
    },
    'MaximumInclusiveValueValidationRule': (newValue, threshold) => {
      return `最大值为 ${Utilities.getValue(threshold)} (包含)`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `最大字符长度为 ${Utilities.getValue(threshold)}`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `最大值为 ${Utilities.getValue(threshold)}(不包含)`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `请输入一个数字`;
    },
    'NoSpacesValidationRule': (newValue, threshold) => {
      return `不能包含空字符`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `不合法的值`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `不合法的值`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `应包含大小字母，数字和特殊字符`;
    },
    'MediumPasswordValidationRule': (newValue, threshold) => {
      return `至少包含 ${Utilities.getValue(threshold)} 种以下组合:小写字母,大写字母,数字和特殊字符`;
    },
    'URLValidationRule': (newValue, threshold) => {
      return `URL格式不正确`;
    }
  }
};
