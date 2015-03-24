export let data = {
    settings : {
        'numericRegex' : /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
    },
    messages : {
        'isRequired' : 'gereklidir',
        'AlphaNumericOrWhitespaceValidationRule' : (newValue, threshold) => {
            return `sadece alfanumerik karakterler veya boşluk girebilirsiniz`;
        },
        'AlphaNumericValidationRule' : (newValue, threshold) => {
            return `sadece alfanumerik karakterleri girebilirsiniz`;
        },
        'BetweenLengthValidationRule' : (newValue, threshold) => {
            return `uzunluğu ${threshold.minimumLength} ile ${threshold.maximumLength} arasında olmalıdır`;
        },
        'BetweenValueValidationRule' : (newValue, threshold) => {
            return `${threshold.minimumValue} ile ${threshold.maximumValue} arasında bir değer giriniz`;
        },
        'CustomFunctionValidationRule' : (newValue, threshold) => {
            return `geçerli bir değer giriniz`
        },
        'DigitValidationRule' :  (newValue, threshold) => {
            return `sadece rakam girebilirsiniz`;
        },
        'EmailValidationRule' : (newValue, threshold) => {
            return `geçerli bir e-posta giriniz`;
        },
        'EqualityValidationRule' : (newValue, threshold) => {
            if (threshold.otherValueLabel)
                if (threshold.equality)
                    return `değer ${threshold.otherValueLabel}''e eşit olmalıdır`;
                else
                    return `değer ${threshold.otherValueLabel}''den farklı olmalıdır`;
            else if (threshold.equality)
                return `değer ${threshold.otherValue}''e eşit olmalıdır`;
            else
                return `değer ${threshold.otherValue}''den farklı olmalıdır`;
        },
        'InCollectionValidationRule' : (newValue, threshold) => {
            return `geçersiz değer`;
        },
        'MinimumLengthValidationRule' : (newValue, threshold) => {
            return `değer en az ${threshold} karakter uzunluğunda olmalıdır`;
        },
        'MinimumValueValidationRule' : (newValue, threshold) => {
            return `değer ${threshold} veya daha fazla olmalıdır`;
        },
        'MaximumLengthValidationRule' : (newValue, threshold) => { 
            return `değer ${threshold} karakterden uzun olmamalıdır`;
        },
        'MaximumValueValidationRule' : (newValue, threshold) => {
            return `değer ${threshold}''dan az olmalı`;
        },
        'NumericValidationRule' : (newValue, threshold) => {
            return `sadece sayı girebilirsiniz`;
        },
        'RegexValidationRule' : (newValue, threshold) => {
            return `geçerli bir değer giriniz`;
        },
        'StrongPasswordValidationRule' : (newValue, threshold) => {
            if(threshold == 4)
                return `küçük harfler, büyük harfler, sayılar ve işaretlerin birleşimi olmalıdır`;
            else
                return `küçük harfler, büyük harfler, sayılar veya işaretlerden en az ${threshold} değişik tip olmalı`;
        }
    }
}
