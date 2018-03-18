import { Parser, AccessMember, AccessScope } from 'aurelia-binding';
import { isString } from './util';
var PropertyAccessorParser = /** @class */ (function () {
    function PropertyAccessorParser(parser) {
        this.parser = parser;
    }
    PropertyAccessorParser.prototype.parse = function (property) {
        if (isString(property)) {
            return property;
        }
        var accessorText = getAccessorExpression(property.toString());
        var accessor = this.parser.parse(accessorText);
        if (accessor instanceof AccessScope
            || accessor instanceof AccessMember && accessor.object instanceof AccessScope) {
            return accessor.name;
        }
        throw new Error("Invalid property expression: \"" + accessor + "\"");
    };
    PropertyAccessorParser.inject = [Parser];
    return PropertyAccessorParser;
}());
export { PropertyAccessorParser };
export function getAccessorExpression(fn) {
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
