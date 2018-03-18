"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_binding_1 = require("aurelia-binding");
var util_1 = require("./util");
var PropertyAccessorParser = /** @class */ (function () {
    function PropertyAccessorParser(parser) {
        this.parser = parser;
    }
    PropertyAccessorParser.prototype.parse = function (property) {
        if (util_1.isString(property)) {
            return property;
        }
        var accessorText = getAccessorExpression(property.toString());
        var accessor = this.parser.parse(accessorText);
        if (accessor instanceof aurelia_binding_1.AccessScope
            || accessor instanceof aurelia_binding_1.AccessMember && accessor.object instanceof aurelia_binding_1.AccessScope) {
            return accessor.name;
        }
        throw new Error("Invalid property expression: \"" + accessor + "\"");
    };
    PropertyAccessorParser.inject = [aurelia_binding_1.Parser];
    return PropertyAccessorParser;
}());
exports.PropertyAccessorParser = PropertyAccessorParser;
function getAccessorExpression(fn) {
    /* tslint:disable:max-line-length */
    var classic = /^function\s*\([$_\w\d]+\)\s*\{(?:\s*"use strict";)?\s*(?:[$_\w\d.['"\]+;]+)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
    /* tslint:enable:max-line-length */
    var arrow = /^\(?[$_\w\d]+\)?\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
    var match = classic.exec(fn) || arrow.exec(fn);
    if (match === null) {
        throw new Error("Unable to parse accessor function:\n" + fn);
    }
    return match[1];
}
exports.getAccessorExpression = getAccessorExpression;
