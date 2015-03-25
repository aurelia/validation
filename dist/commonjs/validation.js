"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

exports.install = install;
Object.defineProperty(exports, "__esModule", {
	value: true
});

_defaults(exports, _interopRequireWildcard(require("./validation/validationLocaleRepository")));

_defaults(exports, _interopRequireWildcard(require("./validation/validationResult")));

_defaults(exports, _interopRequireWildcard(require("./validation/validationRules")));

_defaults(exports, _interopRequireWildcard(require("./validation/validationRulesCollection")));

_defaults(exports, _interopRequireWildcard(require("./validation/validationGroupBuilder")));

_defaults(exports, _interopRequireWildcard(require("./validation/validation")));

var _validationValidateAttachedBehavior = require("./validation/validateAttachedBehavior");

_defaults(exports, _interopRequireWildcard(_validationValidateAttachedBehavior));

_defaults(exports, _interopRequireWildcard(require("./validation/validateAttachedBehaviorConfig")));

var ValidateAttachedBehavior = _validationValidateAttachedBehavior.ValidateAttachedBehavior;

function install(aurelia) {
	aurelia.withResources(ValidateAttachedBehavior);
}