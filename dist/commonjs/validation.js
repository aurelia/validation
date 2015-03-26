"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

exports.install = install;
Object.defineProperty(exports, "__esModule", {
  value: true
});

_defaults(exports, _interopRequireWildcard(require("./validation/validation-locale-repository")));

_defaults(exports, _interopRequireWildcard(require("./validation/validation-result")));

_defaults(exports, _interopRequireWildcard(require("./validation/validation-rules")));

_defaults(exports, _interopRequireWildcard(require("./validation/validation-rules-collection")));

_defaults(exports, _interopRequireWildcard(require("./validation/validation-group-builder")));

_defaults(exports, _interopRequireWildcard(require("./validation/validation")));

_defaults(exports, _interopRequireWildcard(require("./validation/validate-attached-behavior")));

_defaults(exports, _interopRequireWildcard(require("./validation/validate-attached-behavior-config")));

function install(aurelia) {
  aurelia.globalizeResources("./validation/validate-attached-behavior");
}