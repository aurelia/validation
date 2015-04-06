System.register(["./validation/validation-locale-repository", "./validation/validation-result", "./validation/validation-rules", "./validation/validation-rules-collection", "./validation/validation-group-builder", "./validation/validation", "./validation/validate-attached-behavior", "./validation/validate-attached-behavior-config", "./validation/debouncer"], function (_export) {
  _export("install", install);

  function install(aurelia) {
    aurelia.globalizeResources("./validation/validate-attached-behavior");
  }

  return {
    setters: [function (_validationValidationLocaleRepository) {
      for (var _key in _validationValidationLocaleRepository) {
        _export(_key, _validationValidationLocaleRepository[_key]);
      }
    }, function (_validationValidationResult) {
      for (var _key2 in _validationValidationResult) {
        _export(_key2, _validationValidationResult[_key2]);
      }
    }, function (_validationValidationRules) {
      for (var _key3 in _validationValidationRules) {
        _export(_key3, _validationValidationRules[_key3]);
      }
    }, function (_validationValidationRulesCollection) {
      for (var _key4 in _validationValidationRulesCollection) {
        _export(_key4, _validationValidationRulesCollection[_key4]);
      }
    }, function (_validationValidationGroupBuilder) {
      for (var _key5 in _validationValidationGroupBuilder) {
        _export(_key5, _validationValidationGroupBuilder[_key5]);
      }
    }, function (_validationValidation) {
      for (var _key6 in _validationValidation) {
        _export(_key6, _validationValidation[_key6]);
      }
    }, function (_validationValidateAttachedBehavior) {
      for (var _key7 in _validationValidateAttachedBehavior) {
        _export(_key7, _validationValidateAttachedBehavior[_key7]);
      }
    }, function (_validationValidateAttachedBehaviorConfig) {
      for (var _key8 in _validationValidateAttachedBehaviorConfig) {
        _export(_key8, _validationValidateAttachedBehaviorConfig[_key8]);
      }
    }, function (_validationDebouncer) {
      for (var _key9 in _validationDebouncer) {
        _export(_key9, _validationDebouncer[_key9]);
      }
    }],
    execute: function () {
      "use strict";
    }
  };
});