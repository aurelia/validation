/* */ 
define(['exports', '../utilities'], function (exports, _utilities) {
  'use strict';

  exports.__esModule = true;
  var data = {
    settings: {
      'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
    },
    messages: {
      'isRequired': '必ず入力してください。',
      'onValidateCallback': '有効な値ではありません。',
      'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
        return '半角英数字または半角空白のみ入力できます。';
      },
      'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
        return '半角英数字のみ入力できます。';
      },
      'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
        return '半角英字のみ入力できます。';
      },
      'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
        return '半角英字または半角空白のみ入力できます。';
      },
      'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
        return _utilities.Utilities.getValue(threshold.minimumLength) + '文字から' + _utilities.Utilities.getValue(threshold.maximumLength) + '文字の間で入力してください。';
      },
      'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
        return _utilities.Utilities.getValue(threshold.minimumValue) + 'から' + _utilities.Utilities.getValue(threshold.maximumValue) + 'の間で入力してください。';
      },
      'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
        return '有効な値ではありません。';
      },
      'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
        return '数字のみ入力してください。';
      },
      'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
        return '正しいメールアドレスの形式で入力してください。';
      },
      'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
        return _utilities.Utilities.getValue(threshold.otherValue) + 'でなければなりません。';
      },
      'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
        return _utilities.Utilities.getValue(threshold.otherValue) + 'にすることはできません。';
      },
      'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
        return _utilities.Utilities.getValue(threshold.otherValueLabel) + 'と一致していません。';
      },
      'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
        return _utilities.Utilities.getValue(threshold.otherValueLabel) + 'と同じにすることはできません。';
      },
      'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
        return '有効な値ではありません。';
      },
      'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
        return _utilities.Utilities.getValue(threshold) + '以上で入力してください。';
      },
      'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
        return _utilities.Utilities.getValue(threshold) + '文字以上で入力してください。';
      },
      'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
        return _utilities.Utilities.getValue(threshold) + 'を超えて入力してください。';
      },
      'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
        return _utilities.Utilities.getValue(threshold) + '以下で入力してください。';
      },
      'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
        return _utilities.Utilities.getValue(threshold) + '文字以下で入力してください。';
      },
      'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
        return _utilities.Utilities.getValue(threshold) + '未満で入力してください。';
      },
      'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
        return '数値を入力してください。';
      },
      'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
        return '空白を含めることはできません。';
      },
      'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
        return '有効な値ではありません。';
      },
      'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
        return '有効な値ではありません。';
      },
      'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
        return '英小文字、英大文字、数字、記号のすべてを含める必要があります。';
      },
      'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
        return '英小文字、英大文字、数字、記号の中から' + _utilities.Utilities.getValue(threshold) + '種類の文字の組み合わせである必要があります。';
      },
      'URLValidationRule': function URLValidationRule(newValue, threshold) {
        return '正しいURLの形式で入力してください。';
      }
    }
  };
  exports.data = data;
});