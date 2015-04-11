define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var data = {
    settings: {
      numericRegex: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
    },
    messages: {
      isRequired: 'gereklidir',
      AlphaNumericOrWhitespaceValidationRule: function AlphaNumericOrWhitespaceValidationRule(newValue, threshold) {
        return 'sadece alfanumerik karakterler veya boşluk girebilirsiniz';
      },
      AlphaNumericValidationRule: function AlphaNumericValidationRule(newValue, threshold) {
        return 'sadece alfanumerik karakterleri girebilirsiniz';
      },
      AlphaValidationRule: function AlphaValidationRule(newValue, threshold) {
        return 'sadece harf veya boşluk girebilirsiniz';
      },
      AlphaOrWhitespaceValidationRule: function AlphaOrWhitespaceValidationRule(newValue, threshold) {
        return 'sadece harf veya boşluk girebilirsiniz';
      },
      BetweenLengthValidationRule: function BetweenLengthValidationRule(newValue, threshold) {
        return 'uzunluğu ' + threshold.minimumLength + ' ile ' + threshold.maximumLength + ' arasında olmalıdır';
      },
      BetweenValueValidationRule: function BetweenValueValidationRule(newValue, threshold) {
        return '' + threshold.minimumValue + ' ile ' + threshold.maximumValue + ' arasında bir değer giriniz';
      },
      CustomFunctionValidationRule: function CustomFunctionValidationRule(newValue, threshold) {
        return 'geçerli bir değer giriniz';
      },
      DigitValidationRule: function DigitValidationRule(newValue, threshold) {
        return 'sadece rakam girebilirsiniz';
      },
      EmailValidationRule: function EmailValidationRule(newValue, threshold) {
        return 'geçerli bir e-posta giriniz';
      },
      EqualityValidationRule: function EqualityValidationRule(newValue, threshold) {
        return 'değer ' + threshold.otherValue + '\'\'e eşit olmalıdır';
      },
      InEqualityValidationRule: function InEqualityValidationRule(newValue, threshold) {
        return 'değer ' + threshold.otherValue + '\'\'den farklı olmalıdır';
      },
      EqualityWithOtherLabelValidationRule: function EqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'değer ' + threshold.otherValueLabel + '\'\'e eşit olmalıdır';
      },
      InEqualityWithOtherLabelValidationRule: function InEqualityWithOtherLabelValidationRule(newValue, threshold) {
        return 'değer ' + threshold.otherValueLabel + '\'\'den farklı olmalıdır';
      },
      InCollectionValidationRule: function InCollectionValidationRule(newValue, threshold) {
        return 'geçersiz değer';
      },
      MinimumInclusiveValueValidationRule: function MinimumInclusiveValueValidationRule(newValue, threshold) {
        return 'değer ' + threshold + ' veya daha fazla olmalıdır';
      },
      MinimumLengthValidationRule: function MinimumLengthValidationRule(newValue, threshold) {
        return 'değer en az ' + threshold + ' karakter uzunluğunda olmalıdır';
      },
      MinimumValueValidationRule: function MinimumValueValidationRule(newValue, threshold) {
        return 'daha fazla olmalıdır ' + threshold;
      },
      MaximumInclusiveValueValidationRule: function MaximumInclusiveValueValidationRule(newValue, threshold) {
        return 'değer ' + threshold + '\'\'dan az olmalı';
      },
      MaximumLengthValidationRule: function MaximumLengthValidationRule(newValue, threshold) {
        return 'değer ' + threshold + ' karakterden uzun olmamalıdır';
      },
      MaximumValueValidationRule: function MaximumValueValidationRule(newValue, threshold) {
        return 'değer ' + threshold + '\'\'dan az olmalı';
      },
      NumericValidationRule: function NumericValidationRule(newValue, threshold) {
        return 'sadece sayı girebilirsiniz';
      },
      RegexValidationRule: function RegexValidationRule(newValue, threshold) {
        return 'geçerli bir değer giriniz';
      },
      ContainsOnlyValidationRule: function ContainsOnlyValidationRule(newValue, threshold) {
        return 'geçerli bir değer giriniz';
      },
      StrongPasswordValidationRule: function StrongPasswordValidationRule(newValue, threshold) {
        return 'küçük harfler, büyük harfler, sayılar ve işaretlerin birleşimi olmalıdır';
      },
      MediumPasswordValidationRule: function MediumPasswordValidationRule(newValue, threshold) {
        return 'küçük harfler, büyük harfler, sayılar veya işaretlerden en az ' + threshold + ' değişik tip olmalı';
      }
    }
  };
  exports.data = data;
});