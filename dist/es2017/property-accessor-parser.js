import { Parser, AccessMember, AccessScope } from 'aurelia-binding';
import { isString } from './util';
export class PropertyAccessorParser {
    constructor(parser) {
        this.parser = parser;
    }
    parse(property) {
        if (isString(property)) {
            return property;
        }
        const accessorText = getAccessorExpression(property.toString());
        const accessor = this.parser.parse(accessorText);
        if (accessor instanceof AccessScope
            || accessor instanceof AccessMember && accessor.object instanceof AccessScope) {
            return accessor.name;
        }
        throw new Error(`Invalid property expression: "${accessor}"`);
    }
}
PropertyAccessorParser.inject = [Parser];
export function getAccessorExpression(fn) {
    /* tslint:disable:max-line-length */
    const classic = /^function\s*\([$_\w\d]+\)\s*\{(?:\s*"use strict";)?\s*(?:[$_\w\d.['"\]+;]+)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
    /* tslint:enable:max-line-length */
    const arrow = /^\(?[$_\w\d]+\)?\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
    const match = classic.exec(fn) || arrow.exec(fn);
    if (match === null) {
        throw new Error(`Unable to parse accessor function:\n${fn}`);
    }
    return match[1];
}
