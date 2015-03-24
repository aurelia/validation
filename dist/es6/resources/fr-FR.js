export let data = {
    settings : {
        'numericRegex' : /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
    },
    messages : {
        'isRequired' : 'est obligatoire',
        'AlphaNumericOrWhitespaceValidationRule' : (newValue, threshold) => {
            return `ne peut contenir que des caractères de type numérique ou alphabétique ou avec des espaces`;
        },
        'AlphaNumericValidationRule' : (newValue, threshold) => {
            return `ne peut contenir que des caractères de type numérique ou alphabétique`;
        },
        'BetweenLengthValidationRule' : (newValue, threshold) => {
            return `doit être compris entre between ${threshold.minimumLength} et ${threshold.maximumLength} caratères`;
        },
        'BetweenValueValidationRule' : (newValue, threshold) => {
            return `doit être entre ${threshold.minimumValue} et ${threshold.maximumValue}`;
        },
        'CustomFunctionValidationRule' : (newValue, threshold) => {
            return `n'est pas une valeur valide`
        },
        'DigitValidationRule' : (newValue, threshold) => {
            return `doit contenir uniquement des valeurs nurmérique`;
        },
        'EmailValidationRule' : (newValue, threshold) => {
            return `n'est pas une email valide`;
        },
        'EqualityValidationRule' : (newValue, threshold) => {
            if (threshold.otherValueLabel)
                if (threshold.equality)
                    return `ne correspond pas ${threshold.otherValueLabel}`;
                else
                    return `ne peut pas correspondre ${threshold.otherValueLabel}`;
            else if (threshold.equality)
                return `devrait être ${threshold.otherValue}`;
            else
                return `ne peut être ${threshold.otherValue}`;
        },
        'InCollectionValidationRule' : (newValue, threshold) => {
            return `n'est pas une valeur valide`;
        },
        'MinimumLengthValidationRule' : (newValue, threshold) => {
            return `doit avoir au moins ${threshold} caratères`;
        },
        'MinimumValueValidationRule' : (newValue, threshold) => {
            return `doit être ${threshold} ou plus`;
        },
        'MaximumLengthValidationRule' : (newValue, threshold) => {
            return `ne peut être plus long que ${threshold} caractères`;
        },
        'MaximumValueValidationRule' : (newValue, threshold) => {
            return `doit être moins que ${threshold}`;
        },
        'NumericValidationRule' : (newValue, threshold) => {
            return `doit être numérique`;
        },
        'RegexValidationRule' : (newValue, threshold) => {
            return `n'est pas une valeur valide`;
        },
        'StrongPasswordValidationRule' : (newValue, threshold) => {
            if(threshold == 4)
                return `devrait contenir une combinaison de lettres en miniscule, majuscule, numérique et des caractères spéciaux`;
            else
                return `devrait contenir au moins ${threshold} les caractéristiques suivants: lettres minuscule, lettres majuscule, caractères numérique ou scpéciaux`;
        }
    }
}
