System.register([], function (_export) {
    var data;
    return {
        setters: [],
        execute: function () {
            "use strict";

            data = {
                settings: {
                    numericRegex: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
                },
                messages: {
                    isRequired: "wird benötigt",
                    AlphaNumericOrWhitespaceValidationRule: function (newValue, threshold) {
                        return "darf nur alphanumerische Zeichen oder Leerzeichen beinhalten";
                    },
                    AlphaNumericValidationRule: function (newValue, threshold) {
                        return "darf nur alphanumerische Zeichen beinhalten";
                    },
                    BetweenLengthValidationRule: function (newValue, threshold) {
                        return "muss zwischen " + threshold.minimumLength + " und " + threshold.maximumLength + " Zeichen lang sein";
                    },
                    BetweenValueValidationRule: function (newValue, threshold) {
                        return "muss zwischen " + threshold.minimumValue + " und " + threshold.maximumValue + " sein";
                    },
                    CustomFunctionValidationRule: function (newValue, threshold) {
                        return "ist kein gültiger Wert";
                    },
                    DigitValidationRule: function (newValue, threshold) {
                        return "darf nur Zahlen beinhalten";
                    },
                    EmailValidationRule: function (newValue, threshold) {
                        return "ist keine gültige Email-Adresse";
                    },
                    EqualityValidationRule: function (newValue, threshold) {
                        if (threshold.otherValueLabel) if (threshold.equality) return "entspricht nicht " + threshold.otherValueLabel;else return "darf nicht mit " + threshold.otherValueLabel + " übereinstimmen";else if (threshold.equality) return "sollte " + threshold.otherValue + " sein";else return "sollte nicht " + threshold.otherValue + " sein";
                    },
                    InCollectionValidationRule: function (newValue, threshold) {
                        return "ist kein gültiger Wert";
                    },
                    MinimumLengthValidationRule: function (newValue, threshold) {
                        return "muss mindestens " + threshold + " Zeichen lang sein";
                    },
                    MinimumValueValidationRule: function (newValue, threshold) {
                        return "sollte " + threshold + " oder mehr sein";
                    },
                    MaximumLengthValidationRule: function (newValue, threshold) {
                        return "darf nicht länger als " + threshold + " Zeichen sein";
                    },
                    MaximumValueValidationRule: function (newValue, threshold) {
                        return "muss geringer als " + threshold + " sein";
                    },
                    NumericValidationRule: function (newValue, threshold) {
                        return "muss eine Nummer sein";
                    },
                    RegexValidationRule: function (newValue, threshold) {
                        return "ist kein gültiger Wert";
                    },
                    StrongPasswordValidationRule: function (newValue, threshold) {
                        if (threshold == 4) return "sollte eine Kombination aus Groß- und Kleinbuchstaben, sowie Zahlen und Sonderzeichen enthalten";else return "sollte zumindest " + threshold + " der folgenden Gruppen enthalten: Kleinbuchstaben, Großbuchstaben, Zahlen oder Sonderzeichen";
                    }
                }
            };

            _export("data", data);
        }
    };
});