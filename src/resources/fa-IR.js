/* */ 
define(['exports', '../utilities'], function (exports, _utilities) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.data = undefined;
  var data = exports.data = {
    settings: {
      'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
    },
    messages: {
      'isRequired': 'وارد کردن مقدار این آیتم اجباری است',
      'onValidateCallback': 'مقدار معتبر نیست',
      'AlphaNumericOrWhitespaceValidationRule': function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
        return 'تنها می تواند شامل حروف الفبا یا فضای خالی باشد';        
      },
      'AlphaNumericValidationRule': function AlphaNumericValidationRule(newValue, threshold) {
        return 'تنها می تواند شامل حروف الفبا باشد';
      },
      'AlphaValidationRule': function AlphaValidationRule(newValue, threshold) {
        return 'تنها می تواند شامل حروف باشد';        
      },
      'AlphaOrWhitespaceValidationRule': function AlphaOrWhitespaceValidationRule(newValue, threshold) {
        return 'تنها می تواند شامل حروف یا فضای خالی باشد';
      },
      'BetweenLengthValidationRule': function BetweenLengthValidationRule(newValue, threshold) {
        return 'طول کاراکترها باید بین ' + _utilities.Utilities.getValue(threshold.minimumLength) + ' و ' + _utilities.Utilities.getValue(threshold.maximumLength) + ' باشد';        
      },
      'BetweenValueValidationRule': function BetweenValueValidationRule(newValue, threshold) {
        return 'باید بین ' + _utilities.Utilities.getValue(threshold.minimumValue) + ' و ' + _utilities.Utilities.getValue(threshold.maximumValue) + ' باشد';        
      },
      'CustomFunctionValidationRule': function CustomFunctionValidationRule(newValue, threshold) {
        return 'مقدار معتبر نیست';
      },
      'DigitValidationRule': function DigitValidationRule(newValue, threshold) {
        return 'تنها می تواند شامل اعداد باشد';
      },
      'EmailValidationRule': function EmailValidationRule(newValue, threshold) {
        return 'ایمیل معتبر نیست';
      },
      'EqualityValidationRule': function EqualityValidationRule(newValue, threshold) {
        return 'باید مساوی ' + _utilities.Utilities.getValue(threshold.otherValue) + ' باشد';
      },
      'InEqualityValidationRule': function InEqualityValidationRule(newValue, threshold) {
        return 'نمیتواند معادی ' + _utilities.Utilities.getValue(threshold.otherValue) + ' باشد';
      },
      'EqualityWithOtherLabelValidationRule': function EqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'با ' + _utilities.Utilities.getValue(threshold.otherValueLabel) + 'مطابقت ندارد';
      },
      'InEqualityWithOtherLabelValidationRule': function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'نمی تواند مساوی با ' + _utilities.Utilities.getValue(threshold.otherValueLabel) + ' باشد';
      },
      'InCollectionValidationRule': function InCollectionValidationRule(newValue, threshold) {
        return 'مقدار معتبر نیست';
      },
      'MinimumInclusiveValueValidationRule': function MinimumInclusiveValueValidationRule(newValue, threshold) {
        return 'باید بیشتر یا مساوی ' + _utilities.Utilities.getValue(threshold) + ' باشد';
      },
      'MinimumLengthValidationRule': function MinimumLengthValidationRule(newValue, threshold) {
        return 'طول رشته حداقل باید ' + _utilities.Utilities.getValue(threshold) + ' کاراکتر باشد';
      },
      'MinimumValueValidationRule': function MinimumValueValidationRule(newValue, threshold) {
        return 'باید بیشتر از ' + _utilities.Utilities.getValue(threshold) + ' باشد';
      },
      'MaximumInclusiveValueValidationRule': function MaximumInclusiveValueValidationRule(newValue, threshold) {
        return 'باید کمتر یا مساوی ' + _utilities.Utilities.getValue(threshold) + ' باشد';
      },
      'MaximumLengthValidationRule': function MaximumLengthValidationRule(newValue, threshold) {
        return 'نمی تواند بیش از ' + _utilities.Utilities.getValue(threshold) + ' کاراکتر باشد';
      },
      'MaximumValueValidationRule': function MaximumValueValidationRule(newValue, threshold) {
        return 'باید کمتر از ' + _utilities.Utilities.getValue(threshold) + ' باشد';
      },
      'NumericValidationRule': function NumericValidationRule(newValue, threshold) {
        return 'باید عدد باشد';
      },
      'NoSpacesValidationRule': function NoSpacesValidationRule(newValue, threshold) {
        return 'نمی تواند شامل فضای خالی باشد';
      },
      'RegexValidationRule': function RegexValidationRule(newValue, threshold) {
        return 'مقدار معتبر نیست';
      },
      'ContainsOnlyValidationRule': function ContainsOnlyValidationRule(newValue, threshold) {
        return 'مقدار معتبر نیست';
      },
      'StrongPasswordValidationRule': function StrongPasswordValidationRule(newValue, threshold) {
        return 'باید شامل ترکیبی از حروف کوچک، حروف بزرگ، اعداد و کاراکترهای خاص باشد';
      },
      'MediumPasswordValidationRule': function MediumPasswordValidationRule(newValue, threshold) {
        return 'باید حاوی حداقل ' + _utilities.Utilities.getValue(threshold) + ' کاراکتر از گروه های زیر: حروف کوچک، حروف بزرگ، اعداد و کاراکترهای خاص باشد';
      },
      'URLValidationRule': function URLValidationRule(newValue, threshold) {
        return 'آدرس معتبر نیست';
      }
    }
  };
});