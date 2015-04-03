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
          isRequired: "är obligatoriskt",
          AlphaNumericOrWhitespaceValidationRule: function (newValue, threshold) {
            return "kan enbart innehålla alfanumeriska tecken eller mellanslag";
          },
          AlphaNumericValidationRule: function (newValue, threshold) {
            return "kan enbart innehålla alfanumeriska tecken";
          },
          BetweenLengthValidationRule: function (newValue, threshold) {
            return "måste vara mellan " + threshold.minimumLength + " och " + threshold.maximumLength + " tecken långt";
          },
          BetweenValueValidationRule: function (newValue, threshold) {
            return "måste vara mellan " + threshold.minimumValue + " och " + threshold.maximumValue;
          },
          CustomFunctionValidationRule: function (newValue, threshold) {
            return "är inte ett giltigt värde";
          },
          DigitValidationRule: function (newValue, threshold) {
            return "kan bara innehålla siffror";
          },
          EmailValidationRule: function (newValue, threshold) {
            return "är inte en giltig e-postadress";
          },
          EqualityValidationRule: function (newValue, threshold) {
            if (threshold.otherValueLabel) if (threshold.equality) return "matchar inte " + threshold.otherValueLabel;else return "får inte matcha " + threshold.otherValueLabel;else if (threshold.equality) return "ska vara " + threshold.otherValue;else return "kan inte vara " + threshold.otherValue;
          },
          InCollectionValidationRule: function (newValue, threshold) {
            return "är inget giltigt värde";
          },
          MinimumLengthValidationRule: function (newValue, threshold) {
            return "behöver vara minst " + threshold + " tecken långt";
          },
          MinimumValueValidationRule: function (newValue, threshold) {
            return "måste vara " + threshold + " eller mer";
          },
          MaximumLengthValidationRule: function (newValue, threshold) {
            return "kan inte vara längre än " + threshold + " tecken";
          },
          MaximumValueValidationRule: function (newValue, threshold) {
            return "måste vara mindre än " + threshold;
          },
          NumericValidationRule: function (newValue, threshold) {
            return "måste vara ett nummer";
          },
          RegexValidationRule: function (newValue, threshold) {
            return "är inte ett giltigt värde";
          },
          StrongPasswordValidationRule: function (newValue, threshold) {
            if (threshold == 4) return "ska innehålla en kombination av gemener, versaler, siffror och specialtecken";else return "ska innehålla minst " + threshold + " av följande grupperingar: gemener, versaler, siffror eller specialtecken";
          }
        }
      };

      _export("data", data);
    }
  };
});