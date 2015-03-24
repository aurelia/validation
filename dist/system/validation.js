System.register(["./validation/validationLocaleRepository", "./validation/validationResult", "./validation/validationRules", "./validation/validationRulesCollection", "./validation/validationGroupBuilder", "./validation/validation", "./validation/validateAttachedBehavior"], function (_export) {
	var ValidateAttachedBehavior;

	_export("install", install);

	function install(aurelia) {
		aurelia.withResources(ValidateAttachedBehavior);
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

			ValidateAttachedBehavior = _validationValidateAttachedBehavior.ValidateAttachedBehavior;
		}],
		execute: function () {
			"use strict";
		}
	};
});